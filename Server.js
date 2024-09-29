const express = require("express");
const Path = require("path");
const App = express();
const DotEnv = require("dotenv").config({ path: "./config.env" });
const Server = 8080;
const Mongoose = require("mongoose");
const CreateHallModel = require("./Database.js/CreateRoom");
const BookingDatabase = require("./Database.js/BookingRoom");
const BookingModel = require("./Database.js/BookingRoom");

//MiddleWare
App.use(express.json());

//Creating a Room
App.post("/Api/V1/CreateRoom", (Request, Response, Next) => {
  const NewRoom = (async (Req, Res, Next) => {
    try {
      let PostHall = await CreateHallModel.create(Request.body);
      Response.status(200).json({
        Status: "Success",
        Message: "New Hall Has Been Created",
      });
    } catch (error) {
      Response.status(404).json({
        Status: "Failed",
        Message: error,
      });
    }
  })();
});

App.post("/Api/V1/Book", (Request, Response) => {
  const BookingHall = (async () => {
    try {
      const NewBooking = await BookingDatabase.create(Request.body);
      Response.status(200).json({
        Status: "Success",
        Message: "Room Created Success",
      });
    } catch (error) {
      Response.status(404).json({
        Status: "Failed",
        Message: error,
      });
    }
  })();
});

App.get("/Api/V1/Book", (Request, Response, Next) => {
  const GetAllBook = (async () => {
    const AllRoom = await BookingModel.aggregate([
      {
        $lookup: {
          from: "halls",
          localField: "CommonId",
          foreignField: "CommonId",
          as: "RoomDetails",
        },
      },
      {
        $unwind: "$RoomDetails",
      },
      {
        $project: {
          RoomDetails: {
            Available: 0,
            PriceForOneHour: 0,
            CommonId: 0,
            Amenities: 0,
            __v: 0,
          },
        },
      },
    ]);
    Response.status(200).json({
      Status: "ok",
      Response: AllRoom,
    });
  })();
});

App.get("/Api/V1/CustomerDetails", (Request, Response, Next) => {
  let GetCustomers = (async () => {
    try {
      const GetCustomers = await BookingModel.aggregate([
        {
          $lookup: {
            from: "halls",
            localField: "CommonId",
            foreignField: "CommonId",
            as: "CustomerDetails",
          },
        },
        {
          $unwind: "$CustomerDetails",
        },
        {
          $project: {
            CommonId: 0,
            isBooked: 0,
            CustomerDetails: {
              Available: 0,
              Amenities: 0,
              CommonId: 0,
              PriceForOneHour: 0,
              __v: 0,
            },
          },
        },
      ]);
      Response.status(200).json({
        Status: "Success",
        Message: GetCustomers,
      });
    } catch (error) {
      Response.status(404).json({
        Status: "Failure",
        Message: error,
      });
    }
  })();
});

const MongoConnect = (async () => {
  try {
    let Connected = await Mongoose.connect(process.env.NODE_DATABASE);
    console.log("DB CONNECTED....");
  } catch (err) {
    console.log(err);
  }
})();

App.listen(Server, () => {
  console.log(`SERVER RUNNING IN PORT ${Server} 😇`);
});
