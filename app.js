const express = require("express");
const app = express();

const path = require("path");
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running Successfully");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//Get Players API 1
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/players/", async (request, response) => {
const getPlayersQuery = `
 SELECT
 *
 FROM
 cricket_team;`;
const playersArray = await database.all(getPlayersQuery);
 response.send(
 playersArray.map((eachPlayer) =>
convertDbObjectToResponseObject(eachPlayer))
);
});

//Add Player API 2
app.post("/player/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const addPlayerQuery = `
  insert into
  cricket_team (player_name, jersey_number, role)
  values
  ( `${playerName}` ,
    ${jerseyNumber} ,
    `${role}` ,
  ) `;
  const dbResponse = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//GET PlayerBYId API 3

app.get("/players/:playerId/", (request, response)=>{
  const {playerId} = request.params
  const getPlayerQuery = `
  select *
  from cricket_team 
  where played_id = ${playerId}`
  const playerDetail = await db.get(getPlayerQuery)
  response.send(convertDbObjectToResponseObject(playerDetail))
  
  )

//UPDATE PUT playerDetails API 4
  app.put("/players/:playerId/" , async (request, response) =>{
    const {playerId} = request.params
    const playerDetail = request.body
    const {"playerName , jerseyNumber , role} = playerDetail
    const updatePlayerQuery = `
    update cricket_team 
    set player_name = `${playerName}`,
        jersey_number = ${jerseyNumber} ,
        role = ${role} 
     where player_id = ${playerId}` 
    await db.run(updatePlayerQuery)
    response.send("Player Details Added"
    })

//DELETE API 5
app.delete("/players/:playerId/" , async(request, response) =>{
  const {playerId} = request.params
  const delPlayerQuery = `
  delete from
  cricket_team
  where player_id = ${playerId}`
  await db.run(delPlayerQuery)
  response.send("Player Removed")
})
module.exports = app ;
