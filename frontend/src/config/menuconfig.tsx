import React from 'react';
import {
  BarChartOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  TeamOutlined,
  SafetyOutlined,
  CarOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

// Import pages
import DashboardMain from '../pages/Dashboard/DashboardMain';
import Notifications from '../pages/Dashboard/Notifications';

export interface MenuItem {
  key: string;
  label: string;
  labelEn?: string;
  icon?: React.ReactNode;
  component?: React.ComponentType;
  children?: MenuItem[];
  permission?: string[];
}

// Menu configuration
export const menuConfig: MenuItem[] = [
  {
    key: 'dashboard',
    label: 'แดชบอร์ด',
    labelEn: 'Dashboard',
    icon: <BarChartOutlined />,
    children: [
      {
        key: 'dashboard-main',
        label: 'แดชบอร์ดใบงาน',
        labelEn: 'Dashboard',
        component: DashboardMain,
      },
      {
        key: 'dashboard-notifications',
        label: 'แดชบอร์ดแจ้งเตือน',
        labelEn: 'Notifications',
        component: Notifications,
      },
    ],
  },
  {
    key: 'events',
    label: 'เหตุการณ์',
    labelEn: 'Events',
    icon: <CalendarOutlined />,
    //Children[]
    component: () => (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>เหตุการณ์</h3>
        <p>กำลังพัฒนา...</p>
      </div>
    ),
  },
  {
    key: 'master-data',
    label: 'ข้อมูลหลัก',
    labelEn: 'Master Data',
    icon: <AppstoreOutlined />,
    component: () => (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>ข้อมูลหลัก</h3>
        <p>กำลังพัฒนา...</p>
      </div>
    ),
  },
  {
    key: 'behavior',
    label: 'กลุ่มตรวจจับพฤติกรรม',
    labelEn: 'Behavior Detection Group',
    icon: <TeamOutlined />,
    component: () => (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>กลุ่มตรวจจับพฤติกรรม</h3>
        <p>กำลังพัฒนา...</p>
      </div>
    ),
  },
  {
    key: 'elock',
    label: 'ซีลล็อคทรอนิกส์',
    labelEn: 'Electronic Lock',
    icon: <SafetyOutlined />,
    component: () => (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>ซีลล็อคทรอนิกส์</h3>
        <p>กำลังพัฒนา...</p>
      </div>
    ),
  },
  {
    key: 'delivery',
    label: 'จัดส่งสินค้า',
    labelEn: 'Delivery',
    icon: <CarOutlined />,
    component: () => (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>จัดส่งสินค้า</h3>
        <p>กำลังพัฒนา...</p>
      </div>
    ),
  },
  {
    key: 'reports',
    label: 'รายงาน',
    labelEn: 'Reports',
    icon: <FileTextOutlined />,
    component: () => (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>รายงาน</h3>
        <p>กำลังพัฒนา...</p>
      </div>
    ),
  },
  {
    key: 'settings',
    label: 'ตั้งค่าระบบ',
    labelEn: 'Settings',
    icon: <SettingOutlined />,
    component: () => (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>ตั้งค่าระบบ</h3>
        <p>กำลังพัฒนา...</p>
      </div>
    ),
  },
  {
    key: 'terms',
    label: 'ข้อกำหนดการใช้งาน',
    labelEn: 'Terms of Service',
    icon: <FileTextOutlined />,
    component: () => (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>ข้อกำหนดการใช้งาน</h3>
        <p>กำลังพัฒนา...</p>
      </div>
    ),
  },
  {
    key: 'multi-delivery',
    label: 'การจัดการคู่ส่งหลายเข้าข้างงาน',
    labelEn: 'Multi-Delivery Management',
    icon: <FileTextOutlined />,
    component: () => (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>การจัดการคู่ส่งหลายเข้าข้างงาน</h3>
        <p>กำลังพัฒนา...</p>
      </div>
    ),
  },
];

// Helper function to convert menu config to Ant Design menu items
export const getMenuItems = (language: 'th' | 'en' = 'th'): MenuProps['items'] => {
  return menuConfig.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: language === 'en' && item.labelEn ? item.labelEn : item.label,
    children: item.children?.map((child) => ({
      key: child.key,
      label: language === 'en' && child.labelEn ? child.labelEn : child.label,
    })),
  }));
};

// Helper function to find menu item by key
export const findMenuItemByKey = (key: string, items: MenuItem[] = menuConfig): MenuItem | null => {
  for (const item of items) {
    if (item.key === key) {
      return item;
    }
    if (item.children) {
      const found = findMenuItemByKey(key, item.children);
      if (found) return found;
    }
  }
  return null;
};

// Helper function to get component by menu key
export const getComponentByKey = (key: string): React.ComponentType | null => {
  const menuItem = findMenuItemByKey(key);
  return menuItem?.component || null;
};