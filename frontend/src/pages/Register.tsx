import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import adaLogo from '../assets/ada.png';
import type { RegisterRequest, AuthResponse } from '../types';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: RegisterRequest) => {
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>('/auth/register', values);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      message.success('ลงทะเบียนสำเร็จ');
      navigate('/home');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'ลงทะเบียนไม่สำเร็จ');
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
          maxWidth: 600,
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
          <Title level={3} style={{ margin: '20px 0 10px', color: '#14b8a6' }}>
            สมัครสมาชิก
          </Title>
          <Text type="secondary">กรุณากรอกข้อมูลเพื่อสมัครสมาชิก</Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="ชื่อ"
                name="firstName"
                rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}
              >
                <Input placeholder="ชื่อ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="นามสกุล"
                name="lastName"
                rules={[{ required: true, message: 'กรุณากรอกนามสกุล' }]}
              >
                <Input placeholder="นามสกุล" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="ชื่อผู้ใช้"
            name="username"
            rules={[
              { required: true, message: 'กรุณากรอกชื่อผู้ใช้' },
              { min: 4, message: 'ชื่อผู้ใช้ต้องมีอย่างน้อย 4 ตัวอักษร' }
            ]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#14b8a6' }} />} 
              placeholder="ชื่อผู้ใช้" 
            />
          </Form.Item>

          <Form.Item
            label="อีเมล"
            name="email"
            rules={[
              { required: true, message: 'กรุณากรอกอีเมล' },
              { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#14b8a6' }} />} 
              placeholder="อีเมล" 
            />
          </Form.Item>

          <Form.Item
            label="รหัสผ่าน"
            name="password"
            rules={[
              { required: true, message: 'กรุณากรอกรหัสผ่าน' },
              { min: 6, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#14b8a6' }} />}
              placeholder="รหัสผ่าน"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            label="ยืนยันรหัสผ่าน"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'กรุณายืนยันรหัสผ่าน' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#14b8a6' }} />}
              placeholder="ยืนยันรหัสผ่าน"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
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
              สมัครสมาชิก
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Text>มีบัญชีอยู่แล้ว? </Text>
            <Link to="/login" style={{ color: '#14b8a6', fontWeight: 'bold' }}>
              เข้าสู่ระบบ
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;