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

//Get Players API

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    select *
    from cricket_team
    order by player_id `;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

//Add Player API
app.post("/player/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const addPlayerQuery = `
  insert into
  cricket_team (player_name, jersey_number, role)
  values
  ( ${playerName} ,
    ${jerseyNumber} ,
    ${role} ,
  ) `;
  const dbResponse = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});
