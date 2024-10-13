SELECT clas.relname AS "tableName",
  att.attname AS "columnName",
  bool_or(
    CASE
      WHEN ct.contype = 'p' THEN true
      ELSE false
    END
  ) AS "isPK",
  bool_or(
    CASE
      WHEN ct.contype = 'u' THEN true
      ELSE false
    END
  ) AS "isUnique",
  bool_or(
    CASE
      WHEN ct.contype = 'f' THEN true
      ELSE false
    END
  ) AS "isFK",
  MAX(f.relname) AS "fkTableName",
  MAX(af.attname) AS "fkColumnName",
  CASE
    WHEN data_type IN (
      'character varying',
      'varchar',
      'character',
      'char',
      'text'
    ) THEN 'string'
    WHEN data_type IN (
      'smallint',
      'integer',
      'bigint',
      'decimal',
      'numeric',
      'real',
      'double precision',
      'serial',
      'bigserial'
    ) THEN 'number'
    WHEN data_type = 'boolean' THEN 'boolean'
    WHEN data_type IN (
      'date',
      'timestamp',
      'timestamp without time zone',
      'timestamp with time zone',
      'time',
      'time without time zone',
      'time with time zone'
    ) THEN 'date'
    ELSE 'string'
  END AS type
FROM pg_attribute AS att
  JOIN pg_class AS clas ON att.attrelid = clas.oid
  JOIN pg_namespace AS n ON clas.relnamespace = n.oid
  JOIN information_schema.columns cl ON cl.table_name = clas.relname
  AND column_name = att.attname
  LEFT JOIN pg_constraint AS ct ON ct.conrelid = clas.oid
  AND att.attnum = ANY(ct.conkey)
  LEFT JOIN pg_class AS f ON f.oid = ct.confrelid
  LEFT JOIN pg_attribute AS af ON af.attnum = ct.confkey [1]
  AND af.attrelid = f.oid
WHERE clas.relkind = 'r'
  AND n.nspname = 'public'
  AND att.attnum > 0
GROUP BY clas.relname,
  att.attname,
  ordinal_position,
  data_type
ORDER BY clas.relname,
  ordinal_position