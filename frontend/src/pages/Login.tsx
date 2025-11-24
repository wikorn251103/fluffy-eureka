import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Space } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, BookOutlined, CarOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import adaLogo from '../assets/ada.png';
import type { LoginRequest, AuthResponse } from '../types';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginRequest) => {
    console.log('🔐 Login attempt:', values); // Debug
    setLoading(true);
    
    try {
      console.log('📡 Sending request to:', api.defaults.baseURL + '/auth/login'); // Debug
      
      const response = await api.post<AuthResponse>('/auth/login', values);
      console.log('✅ Login response:', response.data); // Debug
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      message.success('เข้าสู่ระบบสำเร็จ');
      navigate('/home');
    } catch (error: any) {
      console.error('❌ Login error:', error); // Debug
      console.error('❌ Error response:', error.response); // Debug
      
      const errorMessage = error.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ';
      message.error(errorMessage);
      
      // แสดง error details
      if (error.response?.status === 401) {
        message.error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      } else if (error.response?.status === 500) {
        message.error('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#ffff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: 450,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          borderRadius: '12px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img
            src={adaLogo}
            alt="Adasoft Logo"
            style={{ height: '50px', marginBottom: '20px' }}
          />

          <Title
            level={3}
            style={{ margin: '20px 0 10px', color: '#14b8a6' }}
          >
            ระบบติดตามรถขนส่ง
          </Title>

          <Space size="large" style={{ fontSize: '24px', color: '#14b8a6' }}>
            <BookOutlined />
            <HomeOutlined />
            <CarOutlined />
          </Space>

          <div style={{ marginTop: '20px' }}>
            <Text type="secondary">
              กรุณาเข้าสู่ระบบ Adasoft Development Company
            </Text>
          </div>
        </div>

        <div style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <Text strong>Adasoft Development Company</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
  name="username"
  rules={[
    { required: true, message: 'กรุณากรอกอีเมล' },
    { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' } // เพิ่ม validation
  ]}
>
  <Input 
    prefix={<UserOutlined style={{ color: '#14b8a6' }} />} 
    placeholder="อีเมล (example@email.com)" // เปลี่ยน placeholder
  />
</Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#14b8a6' }} />}
              placeholder="รหัสผ่าน"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a href="#" style={{ color: '#14b8a6' }}>จดจำการเข้าสู่ระบบ</a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              loading={loading}
              style={{ 
                background: '#14b8a6', 
                borderColor: '#14b8a6',
                height: '45px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              เข้าสู่ระบบ
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/forgot-password" style={{ color: '#14b8a6' }}>
              ลืมรหัสผ่าน?
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <Text>ยังไม่มีบัญชี? </Text>
            <Link to="/register" style={{ color: '#14b8a6', fontWeight: 'bold' }}>
              สมัครสมาชิก
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;