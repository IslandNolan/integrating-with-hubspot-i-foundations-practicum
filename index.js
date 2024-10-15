const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config();
const HUB_API_KEY = process.env.HUB_API_KEY;

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const headers = {
    "Authorization": `Bearer ${HUB_API_KEY}`,
    "Content-Type": "application/json",
}

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
// ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get("/", async (req, res) => {
    const url =
        "https://api.hubspot.com/crm/v3/objects/pets?properties=name,age,weight,breed";
    try {
        const { data } = await axios.get(url, { headers });
        res.render("index", {
            title: "Pets",
            results: data.results,
        });
    } catch (error) {
        console.error(error);
    }
});

// ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get("/update-cobj", (req, res) => {
    res.render("update", {
        title: "Update Pet Form",
    });
});

// ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post("/update-cobj", async (req, res) => {
    const url = "https://api.hubspot.com/crm/v3/objects/pets";
    const body = {
        properties: {
            name: req.body.name,
            age: req.body.age,
            weight: req.body.weight,
            breed: req.body.breed,
        },
    };

    try {
        await axios.post(url, body, { headers });
        res.redirect("/");
    } catch (err) {
        console.error(err);
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));