import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { CarOutlined, UserOutlined, FileTextOutlined, WarningOutlined } from '@ant-design/icons';

const { Title } = Typography;

const DashboardMain: React.FC = () => {
  return (
    <div>
      <Title level={2}>แดชบอร์ด</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="รถทั้งหมด"
              value={45}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="ผู้ใช้งาน"
              value={128}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="รายงาน"
              value={32}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="แจ้งเตือน"
              value={8}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="กราฟสถิติ" style={{ height: '400px' }}>
            <div style={{ textAlign: 'center', paddingTop: '150px' }}>
              <p>กราฟแสดงสถิติการใช้งาน</p>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="กิจกรรมล่าสุด" style={{ height: '400px' }}>
            <div>
              <p>• รถ A001 เริ่มเดินทาง 10:30</p>
              <p>• รถ B002 ถึงจุดหมาย 10:25</p>
              <p>• ผู้ใช้ใหม่ลงทะเบียน 10:15</p>
              <p>• รายงานถูกส่ง 10:00</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardMain;