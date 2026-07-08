'use client';

import {
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Select,
  Switch,
} from 'antd';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';

const cls = FIELD_CONTROL_CLASS;

export default function DynamicForm({ fields = [], gutter = [16, 12], className = '' }) {
  return (
    <Row gutter={gutter} className={['dynamic-form', className].filter(Boolean).join(' ')}>
      {fields.map((field) => {
        const {
          type = 'text',
          name,
          label,
          rules,
          options,
          props: controlProps = {},
          col,
          colStart,
          span,
          offset,
          ...itemProps
        } = field;

        let control;

        switch (type) {
          case 'number':
            control = (
              <InputNumber className={cls} style={{ width: '100%' }} {...controlProps} />
            );
            break;
          case 'select':
            control = <Select className={cls} options={options} {...controlProps} />;
            break;
          case 'date':
            control = (
              <DatePicker className={cls} style={{ width: '100%' }} {...controlProps} />
            );
            break;
          case 'textarea':
            control = <Input.TextArea className={cls} {...controlProps} />;
            break;
          case 'checkbox':
            control = <Checkbox {...controlProps} />;
            break;
          case 'switch':
            control = <Switch {...controlProps} />;
            break;
          case 'radio':
            control = <Radio.Group options={options} {...controlProps} />;
            break;
          case 'password':
            control = <Input.Password className={cls} {...controlProps} />;
            break;
          default:
            control = <Input className={cls} {...controlProps} />;
        }

        const valuePropName =
          itemProps.valuePropName ??
          (type === 'checkbox' || type === 'switch' ? 'checked' : undefined);

        return (
          <Col
            key={name}
            span={span ?? col ?? 24}
            offset={offset ?? colStart}
          >
            <Form.Item
              {...itemProps}
              name={name}
              label={label}
              rules={rules}
              valuePropName={valuePropName}
            >
              {control}
            </Form.Item>
          </Col>
        );
      })}
    </Row>
  );
}
