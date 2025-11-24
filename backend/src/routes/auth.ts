import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Register - ใช้ email เป็น username
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, company } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: email },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: email, // ใช้ email เป็น username
        password: hashedPassword,
        firstName,
        lastName,
        email,
        company: company || 'Adasoft Development Company'
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'ลงทะเบียนสำเร็จ',
      token,
      user: {
        id: user.id,
        username: user.email, // ส่ง email เป็น username
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company
      }
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
  }
});

// Login - ใช้ email ในการ login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body; // รับเป็น username แต่จริงๆ คือ email

    console.log('🔐 Login attempt with email:', username);

    // ค้นหาด้วย email (รองรับทั้ง username field และ email field)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: username },
          { username: username }
        ]
      }
    });

    console.log('👤 User found:', user ? `Yes (${user.email})` : 'No');

    if (!user) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    console.log('🔑 Password valid:', isValidPassword);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for:', user.email);

    res.json({
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: {
        id: user.id,
        username: user.email, // ส่ง email เป็น username
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        company: user.company
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', 
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined 
    });
  }
});

export default router;