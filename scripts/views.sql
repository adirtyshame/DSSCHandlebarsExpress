DROP VIEW driversnode;
CREATE VIEW driversnode
AS SELECT
   d.id AS driverId,
   sp.driverNo AS driverNo,
   CAST(sp.id AS SIGNED) AS seasonParticipationId,
   ur.role as role,
   sp.teamName AS teamName,
   dt.name AS driverTypeName,
   d.email AS driverMail,
   d.password AS password,
   d.firstName AS driverFirstName,
   d.lastName AS driverLastName,
   d.dateOfBirth AS dateOfBirth,
   a.street AS street,
   a.zipCode AS zip,
   a.city AS city,
   c.name AS country
FROM 
	seasonparticipation sp 
join 
	driver d on d.id = sp.driver_id
join
	Driver_UserRole dr on dr.Driver_id = d.id
join
	UserRole ur on dr.roles_id = ur.id
join 
	address a on a.id = d.address_id 
join 
	country c on c.id = a.country_id 
join 
	drivertype dt on dt.id = sp.driverType_id 
join 
	season s on s.id = dt.season_id and s.currentSeason = 1;

DROP VIEW heatsnode;
CREATE VIEW heatsnode
AS SELECT
   h.id as heatId,
   s.name AS seasonName,
   e.name AS eventName,
   e.description AS eventDescription,
   r.name AS raceName,(case r.racingType when 0 then 'WERTUNG' when 1 then 'TRAINING' end) AS racingType,
   h.heatNo AS heatNo,
   h.clientTimestamp AS timeStamp,
   sp.driverNo AS driverNo,
   sp.teamName AS teamName,
   rc.shortName AS classShortName,
   rc.name AS className,
   rc.description AS classDescription,
   dt.name AS driverTypeName,
   d.firstName AS driverFirstName,
   d.lastName AS driverLastName,(case h.lane when 0 then 'LEFT' when 1 then 'RIGHT' end) AS raceLane,(case h.status when 0 then 'READY' when 1 then 'OK' when 2 then 'EARLY' when 3 then 'CANCELED' when 4 then 'INVALID' end) AS raceStatus,
   rc.indexTime AS indexTime,
   h.timeReaction AS timeReaction,
   h.timeSpeed AS timeSpeed,
   h.timeTotal AS timeTotal,round(((0.01 * 3600) / (h.timeTotal - h.timeSpeed)),3) AS topSpeed
FROM ((((((((heat h join craft c on((c.id = h.craft_id))) join racingclass rc on((rc.id = c.racingClass_id))) join seasonparticipation sp on((sp.id = c.seasonParticipation_id))) join driver d on((d.id = sp.driver_id))) join drivertype dt on((dt.id = sp.driverType_id))) join race r on((r.id = h.race_id))) join event e on((e.id = r.event_id))) join season s on((s.id = e.season_id)));


DROP VIEW scootersnode;
CREATE VIEW scootersnode
AS SELECT
   c.id AS craftId,
   sp.driverNo AS driverNo,
   m.name AS manufacturerName,
   sm.name AS scooterName,
   rc.shortName AS classShortName,
   rc.name AS className,(select count(h.id)
FROM heat h 
where (h.craft_id = c.id)) AS runs from (((((craft c join seasonparticipation sp on((sp.id = c.seasonParticipation_id))) join scootermodel sm on((sm.id = c.scooterModel_id))) join manufacturer m on((m.id = sm.manufacturer_id))) join racingclass rc on((rc.id = c.racingClass_id))) join season s on(((s.id = rc.season_id) and (s.currentSeason = 1))));