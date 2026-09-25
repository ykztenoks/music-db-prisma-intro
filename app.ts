import express from "express";
import "dotenv/config";
import morgan from "morgan";
import prisma from "./lib/prisma.js";
import cors from "cors"

const app = express();


app.use(express.json());
app.use(morgan("dev"));
app.use(cors({origin: process.env.CLIENT_URL}))

app.get("/", async (req, res) => {
  try {
    res.status(200).json({ message: "We are here!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get("/songs", async (req, res) => {
  try {
    const response = await prisma.song.findMany({include:{artist: true}})

    res.status(200).json(response)
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.get("/songs/:id", async (req, res) => {
  try {
    const {id} = req.params
    const response = await prisma.song.findUnique({where: {id: id}})

    res.status(200).json(response)
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

app.post("/songs", async (req, res) => {
    try {
        const {title, genre, duration, artistId} = req.body

        const response = await prisma.song.create({data: {title, genre, duration, artistId}})
        res.status(201).json({message: "created successfully", song: response})
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

app.patch("/songs/:id", async( req, res) => {
    try {
        const {id} = req.params
        const response = await prisma.song.update({where: {id:id}, data: {...req.body}})

        res.status(200).json({message: "updated successfully", response })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

app.delete("/song/:id", async (req, res) => {
     try {
        const {id} = req.params

        const response = await prisma.song.delete({where: {id: id}}) 

        res.status(200).json({message: "deleted successfully", response })

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

app.post("/artist", async (req, res) => {
     try {
        const {name, age, nationality} = req.body

        const response = await prisma.artist.create({data: {name, age, nationality}})

        res.status(201).json({message: "artist created successfully", response})
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

app.get("/artists", async (req, res) => {
     try {
        const response = await prisma.artist.findMany()

        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

app.listen(process.env.PORT || 8080, () => {
  console.clear();

  console.log("server up and running");
});
