require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
const path = require('node:path');

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());

// Supabase Auth
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Database CRUD functions

// TODOLIST
// Create
app.post('/todolist', async (req, res) => {
    const { userId, moduleName } = req.body;
    // console.log('userId: ', userId);
    // console.log('moduleName: ', moduleName);

    let newTodolist = {
        user_id: userId,
        module_name: moduleName,
    }

    const { data, error } = await supabase
        .from('module_todo_list')
        .insert(newTodolist)
        .select();

    if (error) {
        console.log(error);
    }
    res.send({ data });
});
// Read
app.get('/todolist', async (req, res) => {
    const { userId } = req.query;
    const { data, error } = await supabase
        .from('module_todo_list')
        .select('id, module_name')
        .eq('user_id', userId)

    if (error) {
        console.log(error);
    }
    res.send({ data });
});
// Update
app.put('/todolist', async (req, res) => {
    const { userId, modules } = req.body;
    console.log('userId: ', userId);
    console.log('modules: ', modules);
    for (let mod of modules) {
        const { error } = await supabase
            .from('module_todo_list')
            .update({ module_name: mod.name })
            .eq('id', mod.id)
            .select();

        if (error) {
            console.log(error);
        }
    }
    res.send({ status: 200 });
});
// Delete
app.delete('/todolist', async (req, res) => {
    const { id, userId } = req.query;
    console.log('delete todolist id: ', id, 'userId: ', userId);
    const { data, error } = await supabase
        .from('module_todo_list')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select();

    if (error) {
        console.log(error);
    }
    res.send({ data });
});

// TODOITEM
// Create
app.post('/todoitem', async (req, res) => {
    console.log('create todoitem');
    console.log(req.body);
    let { summary, deadlineDate, todolistId } = req.body;
    console.log({ summary, deadlineDate, todolistId });

    let newTodoitem = {
        summary: summary,
        deadline_date: deadlineDate,
        module_todo_list_id: todolistId,
    }

    const { data, error } = await supabase
        .from('module_todo_item')
        .insert(newTodoitem)
        .select();

    if (error) {
        console.log(error);
    }
    res.send({ data });
});
// Read
app.get('/todoitem', async (req, res) => {
    const { todolistId } = req.query;
    const { data, error } = await supabase
        .from('module_todo_item')
        .select()
        .eq('module_todo_list_id', todolistId);

    if (error) {
        console.log(error);
    }
    res.send({ data });
});
// Update
app.put('/todoitem', async (req, res) => {

});
// Delete
app.delete('/todoitem', async (req, res) => {
    const { id } = req.query;
    console.log('DELETE todoitem: ', id);

    const { data, error } = await supabase
        .from('module_todo_item')
        .delete()
        .eq('id', id)
        .select();

    if (error) {
        console.log(error);
    }
    res.send({ data });
});