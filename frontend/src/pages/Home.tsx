import React, { useEffect, useState } from 'react';
import { Layout, Menu, Card, Avatar, Button, Typography, Tabs, Form, Input, message, Dropdown, theme, App } from 'antd';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  BulbOutlined,
  BulbFilled
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import api from '../api/axios';
import adaLogo from '../assets/ada.png';
import type { User } from '../types';
import { getMenuItems, getComponentByKey } from '../config/menuconfig';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// แยก component เพื่อให้ใช้ App.useApp() ได้
const HomeContent: React.FC<{ darkMode: boolean; setDarkMode: (value: boolean) => void }> = ({ darkMode, setDarkMode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [language, setLanguage] = useState<'th' | 'en'>('th');
  const [selectedMenu, setSelectedMenu] = useState<string>('user-profile');
  const [collapsed, setCollapsed] = useState(false); // เพิ่ม state สำหรับ collapse
  const { modal } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Translations
  const translations = {
    th: {
      userInfo: 'ข้อมูลผู้ใช้',
      personalInfo: 'ข้อมูลส่วนตัว',
      username: 'ชื่อผู้ใช้',
      firstName: 'ชื่อ',
      lastName: 'นามสกุล',
      email: 'อีเมล',
      role: 'ชื่อ-นามสกุล',
      edit: 'แก้ไข',
      save: 'บันทึก',
      cancel: 'ยกเลิก',
      logout: 'ออกจากระบบ',
      changePassword: 'เปลี่ยนรหัสผ่าน',
      admin: 'ผู้ดูแลระบบ',
      loading: 'กำลังโหลด...',
      logoutConfirm: 'คุณต้องการออกจากระบบใช่หรือไม่?',
      yes: 'ใช่',
      no: 'ยกเลิก',
    },
    en: {
      userInfo: 'User Information',
      personalInfo: 'Personal Information',
      username: 'Username',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      role: 'Full Name',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      logout: 'Logout',
      changePassword: 'Change Password',
      admin: 'Administrator',
      loading: 'Loading...',
      logoutConfirm: 'Are you sure you want to logout?',
      yes: 'Yes',
      no: 'Cancel',
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get<User>('/user/profile');
      setUser(response.data);
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    modal.confirm({
      title: t.logout,
      content: t.logoutConfirm,
      okText: t.yes,
      cancelText: t.no,
      onOk: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        message.success('ออกจากระบบสำเร็จ');
        navigate('/login');
      }
    });
  };

  const handleUpdateProfile = async (values: any) => {
    try {
      const response = await api.put('/user/profile', values);
      setUser(response.data.user);
      setEditMode(false);
      message.success('อัปเดตข้อมูลสำเร็จ');
    } catch (error) {
      message.error('ไม่สามารถอัปเดตข้อมูลได้');
    }
  };

  // Get display name
  const displayName = user ? `${user.firstName} ${user.lastName}` : '';

  // User dropdown menu
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      handleLogout();
    } else if (key === 'user-profile') {
      setSelectedMenu('user-profile');
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: (
        <div>
          <div style={{ fontWeight: 'bold' }}>{displayName}</div>
          <div style={{ fontSize: '12px', color: darkMode ? '#999' : '#666' }}>{user?.email}</div>
        </div>
      ),
      disabled: true
    },
    {
      type: 'divider'
    },
    {
      key: 'user-profile',
      icon: <UserOutlined />,
      label: t.userInfo
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t.logout,
      danger: true
    }
  ];

  // Render content based on selected menu
  const renderContent = () => {
    // User profile page
    if (selectedMenu === 'user-profile') {
      return (
        <>
          <Title level={2} style={{ marginBottom: '24px', color: darkMode ? '#fff' : '#000' }}>
            {t.userInfo}
          </Title>
          
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <Card 
              style={{ 
                flex: '0 0 350px',
                boxShadow: darkMode 
                  ? '0 2px 8px rgba(0,0,0,0.4)' 
                  : '0 2px 8px rgba(0,0,0,0.1)',
                background: darkMode ? '#1f1f1f' : '#fff',
                border: darkMode ? '1px solid #303030' : '1px solid #f0f0f0'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <Avatar 
                  size={120} 
                  icon={<UserOutlined />} 
                  style={{ 
                    background: '#14b8a6', 
                    marginBottom: '16px',
                    boxShadow: '0 4px 12px rgba(20, 184, 166, 0.3)'
                  }}
                />
                <Title level={4} style={{ color: darkMode ? '#fff' : '#000' }}>
                  {displayName}
                </Title>
                <Text type="secondary" style={{ color: darkMode ? '#999' : '#666' }}>
                  {user?.username}
                </Text>
                <div style={{ marginTop: '20px' }}>
                  <Button 
                    icon={<EditOutlined />}
                    block
                    style={{ 
                      background: '#14b8a6',
                      color: '#fff',
                      borderColor: '#14b8a6',
                      fontWeight: 'bold'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#0d9488'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#14b8a6'}
                  >
                    {t.changePassword}
                  </Button>
                </div>
              </div>
            </Card>

            <Card 
              style={{ 
                flex: 1,
                minWidth: '400px',
                boxShadow: darkMode 
                  ? '0 2px 8px rgba(0,0,0,0.4)' 
                  : '0 2px 8px rgba(0,0,0,0.1)',
                background: darkMode ? '#1f1f1f' : '#fff',
                border: darkMode ? '1px solid #303030' : '1px solid #f0f0f0'
              }}
            >
              <Tabs 
                defaultActiveKey="1"
                tabBarExtraContent={
                  !editMode ? (
                    <Button 
                      icon={<EditOutlined />}
                      onClick={() => setEditMode(true)}
                      style={{
                        color: darkMode ? '#14b8a6' : '#14b8a6',
                        borderColor: darkMode ? '#14b8a6' : '#14b8a6'
                      }}
                    >
                      {t.edit}
                    </Button>
                  ) : null
                }
                items={[
                  {
                    key: '1',
                    label: t.personalInfo,
                    children: (
                      <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleUpdateProfile}
                        disabled={!editMode}
                      >
                        <Form.Item 
                          label={<span style={{ color: darkMode ? '#fff' : '#000' }}>{t.username}</span>}
                          name="username"
                        >
                          <Input 
                            prefix={<UserOutlined />} 
                            disabled 
                            style={{
                              background: darkMode ? '#141414' : '#f5f5f5',
                              color: darkMode ? '#999' : '#666',
                              borderColor: darkMode ? '#303030' : '#d9d9d9'
                            }}
                          />
                        </Form.Item>

                        <div style={{ display: 'flex', gap: '16px' }}>
                          <Form.Item 
                            label={<span style={{ color: darkMode ? '#fff' : '#000' }}>{t.firstName}</span>}
                            name="firstName"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}
                          >
                            <Input 
                              prefix={<UserOutlined />}
                              style={{
                                background: darkMode && !editMode ? '#141414' : undefined,
                                color: darkMode ? '#fff' : '#000',
                                borderColor: darkMode ? '#303030' : '#d9d9d9'
                              }}
                            />
                          </Form.Item>

                          <Form.Item 
                            label={<span style={{ color: darkMode ? '#fff' : '#000' }}>{t.lastName}</span>}
                            name="lastName"
                            style={{ flex: 1 }}
                            rules={[{ required: true, message: 'กรุณากรอกนามสกุล' }]}
                          >
                            <Input 
                              prefix={<UserOutlined />}
                              style={{
                                background: darkMode && !editMode ? '#141414' : undefined,
                                color: darkMode ? '#fff' : '#000',
                                borderColor: darkMode ? '#303030' : '#d9d9d9'
                              }}
                            />
                          </Form.Item>
                        </div>

                        <Form.Item 
                          label={<span style={{ color: darkMode ? '#fff' : '#000' }}>{t.email}</span>}
                          name="email"
                          rules={[
                            { required: true, message: 'กรุณากรอกอีเมล' },
                            { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }
                          ]}
                        >
                          <Input
                            style={{
                              background: darkMode && !editMode ? '#141414' : undefined,
                              color: darkMode ? '#fff' : '#000',
                              borderColor: darkMode ? '#303030' : '#d9d9d9'
                            }}
                          />
                        </Form.Item>

                        {editMode && (
                          <Form.Item>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Button 
                                type="primary" 
                                htmlType="submit"
                                style={{ 
                                  background: '#14b8a6', 
                                  borderColor: '#14b8a6',
                                  fontWeight: 'bold'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#0d9488'}
                                onMouseLeave={(e) => e.currentTarget.style.background = '#14b8a6'}
                              >
                                {t.save}
                              </Button>
                              <Button 
                                onClick={() => {
                                  setEditMode(false);
                                  form.setFieldsValue(user);
                                }}
                                style={{
                                  borderColor: darkMode ? '#303030' : '#d9d9d9',
                                  color: darkMode ? '#fff' : '#000'
                                }}
                              >
                                {t.cancel}
                              </Button>
                            </div>
                          </Form.Item>
                        )}
                      </Form>
                    )
                  }
                ]}
              />
            </Card>
          </div>
        </>
      );
    }

    // Get component from menu config
    const Component = getComponentByKey(selectedMenu);
    
    if (Component) {
      return <Component />;
    }

    // Default fallback
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={3} style={{ color: darkMode ? '#fff' : '#000' }}>
          กำลังพัฒนา...
        </Title>
        <Text type="secondary" style={{ color: darkMode ? '#999' : '#666' }}>
          หน้านี้อยู่ระหว่างการพัฒนา
        </Text>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        color: darkMode ? '#fff' : '#000' 
      }}>
        {t.loading}
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        width={250}
        collapsedWidth={80}
        collapsed={collapsed}
        trigger={null}
        style={{ 
          background: darkMode ? '#141414' : '#fff',
          borderRight: `1px solid ${darkMode ? '#303030' : '#f0f0f0'}`,
          boxShadow: darkMode ? '2px 0 8px rgba(0,0,0,0.3)' : 'none',
          transition: 'all 0.2s'
        }}
      >
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          borderBottom: `1px solid ${darkMode ? '#303030' : '#f0f0f0'}`,
          background: darkMode ? '#0a0a0a' : '#fafafa'
        }}>
          <img 
            src={adaLogo} 
            alt="Adasoft Logo" 
            style={{ 
              width: collapsed ? '32px' : '48px',
              maxWidth: collapsed ? '32px' : '48px',
              filter: darkMode ? 'brightness(1.2)' : 'none',
              transition: 'all 0.3s'
            }}
          />
          {!collapsed && (
            <Title 
              level={5} 
              style={{ 
                margin: '10px 0 0', 
                color: '#14b8a6',
                textShadow: darkMode ? '0 0 10px rgba(20, 184, 166, 0.5)' : 'none'
              }}
            >
              DMES System
            </Title>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedMenu]}
          defaultOpenKeys={['dashboard']}
          onClick={({ key }) => setSelectedMenu(key)}
          items={getMenuItems(language)}
          inlineCollapsed={collapsed}
          style={{ 
            borderRight: 0,
            background: darkMode ? '#141414' : '#fff'
          }}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          background: darkMode ? '#0a0a0a' : '#fff',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: darkMode 
            ? '0 2px 8px rgba(0,0,0,0.4)' 
            : '0 2px 8px rgba(0,0,0,0.1)',
          borderBottom: `1px solid ${darkMode ? '#303030' : '#f0f0f0'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MenuFoldOutlined 
              onClick={() => setCollapsed(!collapsed)}
              style={{ 
                fontSize: '20px', 
                cursor: 'pointer',
                color: darkMode ? '#fff' : '#000',
                transition: 'all 0.3s',
                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)'
              }} 
            />
            <Text 
              strong 
              style={{ 
                fontSize: '16px',
                color: darkMode ? '#fff' : '#000'
              }}
            >
              {user?.company}
            </Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Language Switcher */}
            <Button 
              type="text"
              onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
              style={{ 
                fontWeight: 'bold',
                color: darkMode ? '#14b8a6' : '#14b8a6'
              }}
            >
              {language === 'th' ? 'TH' : 'EN'}
            </Button>

            {/* Notifications */}
            <BellOutlined 
              style={{ 
                fontSize: '18px', 
                cursor: 'pointer',
                color: darkMode ? '#fff' : '#000'
              }} 
            />

            {/* Dark Mode Toggle */}
            <Button
              type="text"
              icon={darkMode ? <BulbFilled style={{ color: '#ffd700' }} /> : <BulbOutlined />}
              onClick={() => setDarkMode(!darkMode)}
              style={{
                fontSize: '18px',
                color: darkMode ? '#ffd700' : '#666'
              }}
            />

            {/* User Dropdown */}
            <Dropdown 
              menu={{ items: userMenuItems, onClick: handleMenuClick }} 
              placement="bottomRight" 
              arrow
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.3s',
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = darkMode ? '#1f1f1f' : '#f0f0f0';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <Avatar 
                  size={36} 
                  icon={<UserOutlined />} 
                  style={{ 
                    background: '#14b8a6',
                    boxShadow: '0 2px 8px rgba(20, 184, 166, 0.4)'
                  }}
                />
                <Text 
                  style={{ 
                    fontSize: '14px', 
                    fontWeight: 'bold',
                    color: darkMode ? '#fff' : '#000'
                  }}
                >
                  {displayName}
                </Text>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ 
          padding: '24px', 
          background: darkMode ? '#000' : '#f0f2f5',
          minHeight: 'calc(100vh - 128px)'
        }}>
          {renderContent()}
        </Content>

        {/* Footer */}
        <div style={{ 
          background: darkMode ? '#0a0a0a' : '#fff',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `1px solid ${darkMode ? '#303030' : '#f0f0f0'}`,
          boxShadow: darkMode ? '0 -2px 8px rgba(0,0,0,0.3)' : 'none'
        }}>
          <Text type="secondary" style={{ color: darkMode ? '#999' : '#666' }}>
            © 2025 DMES Powered by Adasoft
          </Text>
          <Text type="secondary" style={{ color: darkMode ? '#999' : '#666' }}>
            เวอร์ชัน 1.0.0
          </Text>
        </div>
      </Layout>
    </Layout>
  );
};

// Main component ห่อด้วย ConfigProvider และ App
const Home: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#14b8a6',
          colorBgContainer: darkMode ? '#1f1f1f' : '#ffffff',
          colorBgElevated: darkMode ? '#1f1f1f' : '#ffffff',
          colorBorder: darkMode ? '#303030' : '#d9d9d9',
          colorText: darkMode ? '#ffffff' : '#000000',
          colorTextSecondary: darkMode ? '#999999' : '#666666',
        },
      }}
    >
      <App>
        <HomeContent darkMode={darkMode} setDarkMode={setDarkMode} />
      </App>
    </ConfigProvider>
  );
};

export default Home;