import fs, { constants } from 'fs'
import { readFile, writeFile, access, mkdir } from "fs/promises"
import { createServer } from 'http';
const port = 8080;


let getTodayFile = () => {
    const today = new Date().toISOString().split("T")[0];
    return `./data/${today}.json`;
}

let fileExistCheck = async (file) => {
    try {
        await mkdir("./data", { recursive: true }) // folder checking
        await access(file, constants.F_OK); // file exist check korbe
    }
    catch {
        await writeFile(file, "[]"); // file na thakle create korbe ekta array
    }
}

const server = createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");


    if (req.method === "OPTIONS") {
        res.statusCode = 200;
        return res.end();
    }

    const file = getTodayFile();
    console.log(file);
    await fileExistCheck(file);

    if (req.method === "GET" && req.url === "/todos") {
        const data = await readFile(file, "utf-8");
        res.end(data)
    }
    else if (req.method === "POST" && req.url === "/todos") {
        let body = "";
        req.on("data", chunk => (body += chunk));  // chunk gulo ekotro kore puro string make
        req.on("end", async () => {
            const newTodo = JSON.parse(body); // string ke json obj te rupantor

            const todos = JSON.parse(await readFile(file, "utf-8"));  // file ta ke porse

            todos.push({ id: Date.now(), ...newTodo }); // date.now produces a unic id
            await writeFile(file, JSON.stringify(todos, null, 2)); // file update korche string e rupantor kore new todos add  kore, null 2 mane hocche ektu gap thakar jonno

            res.end(JSON.stringify({ message: "Task added", todos }));
        })
    }
    else if (req.method === "PATCH" && req.url.startsWith("/todos")) {
        const id = req.url.split("/")[2];
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", async () => {
            const { text } = JSON.parse(body);

            const todos = JSON.parse(await readFile(file, "utf-8"))

            const updated = todos.map(todo => todo.id.toString() === id ? { ...todo, text } : todo);
            await writeFile(file, JSON.stringify(updated, null, 2));
            res.end(JSON.stringify({ message: "Task updated", todos: updated }))
        })
    }
    else if (req.method === "DELETE" && req.url.startsWith("/todos")) {
        const id = req.url.split("/")[2]; // id nicche
        const todos = JSON.parse(await readFile(file, "utf-8"));
        const updated = todos.filter(todo => todo.id.toString() !== id);
        await writeFile(file, JSON.stringify(updated, null, 2));
        res.end(JSON.stringify({ message: "Task deleted", todos: updated }));
    }
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Not found" }));
    }

})

server.listen(port)