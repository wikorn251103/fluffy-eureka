import React from 'react';
import { Card, List, Badge, Typography, Tag } from 'antd';
import { BellOutlined, WarningOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Notifications: React.FC = () => {
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'รถ A001 เบี่ยงเส้นทาง',
      description: 'ตรวจพบการเบี่ยงเส้นทางที่ไม่ได้กำหนด',
      time: '5 นาทีที่แล้ว',
      icon: <WarningOutlined style={{ color: '#faad14' }} />,
      color: 'warning'
    },
    {
      id: 2,
      type: 'success',
      title: 'รถ B002 ถึงจุดหมาย',
      description: 'ส่งของสำเร็จ ลูกค้าเซ็นรับแล้ว',
      time: '15 นาทีที่แล้ว',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      color: 'success'
    },
    {
      id: 3,
      type: 'info',
      title: 'ผู้ใช้ใหม่ลงทะเบียน',
      description: 'มีผู้ใช้ใหม่เข้าร่วมระบบ',
      time: '30 นาทีที่แล้ว',
      icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
      color: 'processing'
    },
    {
      id: 4,
      type: 'error',
      title: 'รถ C003 หยุดนิ่ง',
      description: 'ไม่มีการเคลื่อนที่เกิน 30 นาที',
      time: '1 ชั่วโมงที่แล้ว',
      icon: <WarningOutlined style={{ color: '#ff4d4f' }} />,
      color: 'error'
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>
          <BellOutlined /> แจ้งเตือน
        </Title>
        <Badge count={notifications.length} showZero>
          <BellOutlined style={{ fontSize: '24px', color: '#14b8a6' }} />
        </Badge>
      </div>

      <Card>
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Tag color={item.color}>{item.time}</Tag>
              ]}
            >
              <List.Item.Meta
                avatar={item.icon}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Notifications;