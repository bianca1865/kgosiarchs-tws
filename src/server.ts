import express from 'express';
import dotenv from 'dotenv';
import projectsRoutes from './routes/projectsRoutes';
import inquiriesRoutes from './routes/inquiriesRoutes';   // ← add this line

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/projects', projectsRoutes);
app.use('/api/inquiries', inquiriesRoutes);   // ← add this line
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
