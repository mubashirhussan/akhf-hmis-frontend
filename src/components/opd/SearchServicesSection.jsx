'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button, Col, Input, Row, Select } from 'antd';
import HmisCard from '@/components/ui/HmisCard';

const SERVICE_CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Category' },
  { value: 'consultation', label: 'Consultation' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'radiology', label: 'Radiology' },
];

export default function SearchServicesSection() {
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // TODO: wire service search API
  };

  return (
    <section className="walk-in-services-section">
      <HmisCard
        title="Search Services"
        headerLayout="inline"
        headerExtra={
          <Row gutter={[12, 12]} align="middle" justify="end" wrap>
            <Col xs={24} sm={8} md={8}>
              <Select
                className="w-full"
                value={category}
                options={SERVICE_CATEGORY_OPTIONS}
                onChange={setCategory}
              />
            </Col>
            <Col xs={24} sm={10} md={11}>
              <Input
                placeholder="Search Services"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onPressEnter={handleSearch}
              />
            </Col>
            <Col xs={24} sm={6} md={5}>
              <Button type="primary" className="walk-in-search-btn w-full" onClick={handleSearch}>
                Search
              </Button>
            </Col>
          </Row>
        }
      >

      <div className="walk-in-services-illustration">
        <Image
          src="/hmis-base-img.svg"
          alt="Search services illustration"
          width={320}
          height={280}
          className="walk-in-services-illustration-img"
          priority={false}
        />
      </div>
      </HmisCard>
    </section>
  );
}
