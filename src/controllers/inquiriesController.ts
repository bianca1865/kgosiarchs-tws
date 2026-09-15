import { Request, Response } from 'express';
import pool from '../database/db';

// Get all inquiries (for Thato's admin dashboard)
export const getAllInquiries = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            'SELECT * FROM inquiries ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Get a single inquiry by id
export const getInquiryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM inquiries WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).send('Inquiry not found');
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Create a new inquiry (public — anyone submitting the contact form)
export const createInquiry = async (req: Request, res: Response) => {
    try {
        const { full_name, email, phone, project_type, message } = req.body;

        if (!full_name || !email || !message) {
            return res.status(400).send('Name, email and message are required');
        }

        const newInquiry = await pool.query(
            `INSERT INTO inquiries (full_name, email, phone, project_type, message)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [full_name, email, phone, project_type, message]
        );

        res.status(201).json(newInquiry.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Update inquiry status (Thato marks it as read/archived)
export const updateInquiryStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['new', 'read', 'archived'];
        if (!validStatuses.includes(status)) {
            return res.status(400).send('Invalid status value');
        }

        const result = await pool.query(
            'UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('Inquiry not found');
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
