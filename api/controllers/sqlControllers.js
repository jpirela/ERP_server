import { QueryTypes } from 'sequelize';
import authenticate from '../../middleware/auth.js';
import getDatabaseConnection from '../../config/database.js';

const getSQL = async (req, res) => {
    try {
        const {
            fields,
            pivotTable,
            joins = [],
            whereCondition = null,
            orderBy = null,
            page: rawPage = 1,
            limit: rawLimit = 50,
            noPagination = false
        } = req.body;

        const page = parseInt(rawPage, 10) || 1;
        const limit = parseInt(rawLimit, 10) || 50;
        const dbName = req.dbName;

        if (!fields || !pivotTable) {
            return res.status(400).json({ error: "Faltan campos obligatorios como 'fields' o 'pivotTable'" });
        }
        
        const sequelize = getDatabaseConnection(dbName);

        let totalPages = 1;
        let totalRecords = 0;
        let firstRecordIndex = 1;
        let lastRecordIndex = 1;
        let safeOffset = (page - 1) * limit;

        console.time('sql_count');
        
        if (!noPagination && page === 1) {
            let countQuery = `SELECT COUNT(*) as total FROM ${pivotTable}`;
            for (const join of joins) {
                const { type = 'LEFT', table, on } = join;
                if (!table || !on) continue;
                countQuery += ` ${type} JOIN ${table} ON ${on}`;
            }
            if (whereCondition) {
                countQuery += ` WHERE ${whereCondition}`;
            }

            const countResult = await sequelize.query(countQuery, { type: QueryTypes.SELECT });

            totalRecords = countResult[0]?.total || 0;
            totalPages = Math.ceil(totalRecords / limit);
            firstRecordIndex = 1;
            lastRecordIndex = Math.min(limit, totalRecords);
        }
        
        console.timeEnd('sql_count');
        console.time('sql_data');

        // Construcción de la consulta principal
        let query = `SELECT ${fields} FROM ${pivotTable}`;
        for (const join of joins) {
            const { type = 'LEFT', table, on } = join;
            if (!table || !on) continue;
            query += ` ${type} JOIN ${table} ON ${on}`;
        }

        if (whereCondition) {
            query += ` WHERE ${whereCondition}`;
        }

        if (orderBy) {
            query += ` ORDER BY ${orderBy}`;
        }

        if (!noPagination) {
            query += ` LIMIT ${limit} OFFSET ${safeOffset}`;
        }

        const results = await sequelize.query(query, { type: QueryTypes.SELECT });

        console.timeEnd('sql_data');
        console.time('response');

        // Si no hay resultados, retornamos respuesta mínima
        if (!results.length) {
            return res.json({
                totalPages: 0,
                currentPage: page,
                totalRecords: 0,
                firstRecordIndex: 0,
                lastRecordIndex: 0,
                items: []
            });
        }

        // Si no hicimos COUNT (por no ser página 1), calculamos basado en resultados actuales
        if (!noPagination && totalRecords === 0) {
            totalRecords = results.length;
            totalPages = 1;
            firstRecordIndex = 1;
            lastRecordIndex = results.length;
        }

        res.json({
            totalPages,
            currentPage: !noPagination ? page : 1,
            totalRecords: !noPagination ? totalRecords : results.length,
            firstRecordIndex: !noPagination ? firstRecordIndex : 1,
            lastRecordIndex: !noPagination ? lastRecordIndex : results.length,
            items: results
        });

        console.timeEnd('response');

    } catch (error) {
        if (error.name === 'SequelizeDatabaseError') {
            return res.status(400).json({ 
                error: 'Error en la sintaxis SQL: ' + error.message
            });
        }
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export default [authenticate, getSQL];
