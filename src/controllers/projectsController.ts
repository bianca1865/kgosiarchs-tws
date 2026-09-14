import { Request, Response } from 'express';
import pool from '../database/db';

// Get all published projects
export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT * FROM projects WHERE is_published = true ORDER BY completion_year DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Get one project by slug
export const getProjectBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const project = await pool.query('SELECT * FROM projects WHERE slug = $1', [slug]);

        if (project.rows.length === 0) {
            return res.status(404).send('Project not found');
        }

        const images = await pool.query(
            'SELECT * FROM project_images WHERE project_id = $1 ORDER BY display_order',
            [project.rows[0].id]
        );

        res.json({ ...project.rows[0], images: images.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Add a new project
export const createProject = async (req: Request, res: Response) => {
    try {
        const { title, slug, category, completion_year, brief, challenge, result } = req.body;

        const newProject = await pool.query(
            `INSERT INTO projects (title, slug, category, completion_year, brief, challenge, result)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [title, slug, category, completion_year, brief, challenge, result]
        );

        res.status(201).json(newProject.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Upload an image for a specific project
export const uploadProjectImage = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const { caption, is_cover, display_order } = req.body;

        if (!req.file) {
            return res.status(400).send('No image file provided');
        }

        const image_url = `/uploads/${req.file.filename}`;

        const newImage = await pool.query(
            `INSERT INTO project_images (project_id, image_url, caption, is_cover, display_order)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [projectId, image_url, caption || null, is_cover === 'true', display_order || 0]
        );

        res.status(201).json(newImage.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};