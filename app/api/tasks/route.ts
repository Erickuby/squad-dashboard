import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'tasks.json');

// Ensure data directory exists
const ensureDataDir = () => {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Read tasks
const readTasks = () => {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error('Error parsing tasks.json:', error);
        return [];
    }
};

// Write tasks
const writeTasks = (tasks: any[]) => {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
};

export async function GET() {
    const tasks = readTasks();
    return NextResponse.json(tasks);
}

export async function POST(request: Request) {
    try {
        const newTask = await request.json();
        const tasks = readTasks();

        // Generate simple ID if not provided
        if (!newTask.id) {
            newTask.id = `task-${Date.now()}`;
        }

        // Add timestamps
        const now = new Date().toISOString();
        newTask.created_at = now;
        newTask.updated_at = now;
        newTask.chat_history = newTask.chat_history || [];
        newTask.bounce_count = 0;

        tasks.unshift(newTask); // Add to beginning
        writeTasks(tasks);

        return NextResponse.json(newTask);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const updateData = await request.json();
        const { id, ...updates } = updateData;

        if (!id) {
            return NextResponse.json({ error: 'Task ID required' }, { status: 400 });
        }

        const tasks = readTasks();
        const index = tasks.findIndex((t: any) => t.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        // Merge updates
        tasks[index] = {
            ...tasks[index],
            ...updates,
            updated_at: new Date().toISOString()
        };

        writeTasks(tasks);

        return NextResponse.json(tasks[index]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
}
