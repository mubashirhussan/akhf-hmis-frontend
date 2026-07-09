'use client';

import {
  Button,
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
  TimePicker,
} from 'antd';
import { FIELD_CONTROL_CLASS } from '@/lib/field-control';
import AgeUnitField from '@/components/ui/AgeUnitField';

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
          case 'time':
            control = (
              <TimePicker className={cls} style={{ width: '100%' }} format="HH:mm" {...controlProps} />
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
          case 'age': {
            const { onChange: ageOnChange, ...ageProps } = controlProps;
            control = (
              <AgeUnitField
                embedded
                {...ageProps}
                onChange={ageOnChange}
              />
            );
            break;
          }
          case 'condition': {
            const { options: conditionOptions, onAdd, newConditionName, ...conditionRest } = controlProps;
            control = (
              <div className="pathology-test-range-condition">
                <Select className={cls} options={conditionOptions} {...conditionRest} />
                <div className="pathology-test-range-new-condition">
                  <Input
                    className={cls}
                    value={newConditionName}
                    placeholder="Add New condition"
                    autoComplete="off"
                    onChange={(e) => conditionRest.onNewConditionChange?.(e.target.value)}
                  />
                  <Button type="link" className="pathology-test-range-new-link" onClick={onAdd}>
                    Add
                  </Button>
                </div>
              </div>
            );
            break;
          }
          case 'unit': {
            const { options: unitOptions, onAddConversionRate, ...unitRest } = controlProps;
            control = (
              <div className="pathology-test-range-unit">
                <Select className={cls} options={unitOptions} placeholder="Select unit" allowClear {...unitRest} />
                <Button
                  type="link"
                  className="pathology-test-range-conversion-link text-left"
                  onClick={onAddConversionRate}
                >
                  Add Conversion Rate
                </Button>
              </div>
            );
            break;
          }
          case 'custom':
            control = controlProps.render ? controlProps.render() : null;
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
