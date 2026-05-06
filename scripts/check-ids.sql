-- Проверка максимальных ID в обеих таблицах
SELECT 'markers' as table_name, MAX(id) as max_id, COUNT(id) as total_count FROM markers 
UNION ALL 
SELECT 'construction_sites' as table_name, MAX(id) as max_id, COUNT(id) as total_count FROM construction_sites
ORDER BY table_name;

-- Поиск дублирующихся ID
SELECT markers.id as markers_id, construction_sites.id as construction_sites_id
FROM markers 
FULL OUTER JOIN construction_sites ON markers.id = construction_sites.id
WHERE markers.id IS NOT NULL AND construction_sites.id IS NOT NULL;
