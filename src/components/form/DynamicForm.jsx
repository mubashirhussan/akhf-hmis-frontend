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
import AgeUnitInput from '@/components/ui/AgeUnitInput';

const cls = FIELD_CONTROL_CLASS;

export default function DynamicForm({ fields = [], gutter = [16, 12], className = '' }) {
  return (
    <Row gutter={gutter} className={['dynamic-form', className].filter(Boolean).join(' ')}>
      {fields.map((field, index) => {
        const {
          type = 'text',
          name,
          label,
          rules,
          options,
          floating,
          required,
          props: controlProps = {},
          col,
          colStart,
          span,
          offset,
          className: fieldClassName,
          ...itemProps
        } = field;

        const fieldKey = Array.isArray(name) ? name.join('-') : (name ?? `field-${index}`);
        const showRequiredMark =
          required ?? rules?.some((rule) => rule && typeof rule === 'object' && rule.required);

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
            // Placeholder required so :placeholder-shown can float labels when value is set
            control = (
              <Input.TextArea
                className={cls}
                {...controlProps}
                placeholder={controlProps.placeholder ?? ' '}
              />
            );
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
            control = <AgeUnitInput className={controlProps.className} />;
            break;
          }
          case 'dobAge': {
            const DobAgeFormControl = controlProps.component;
            control = DobAgeFormControl ? <DobAgeFormControl {...controlProps} /> : null;
            break;
          }
          case 'condition': {
            const { options: conditionOptions, onAdd, newConditionName: _newConditionName, onNewConditionChange: _onNewConditionChange, ...conditionRest } = controlProps;
            control = (
              <div className="pathology-test-range-condition">
                <Select className={cls} options={conditionOptions} {...conditionRest} />
                <div className="pathology-test-range-new-condition">
                  <Form.Item name="newCondition" noStyle>
                    <Input
                      className={cls}
                      placeholder="Add New condition"
                      autoComplete="off"
                    />
                  </Form.Item>
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

        const formItem = (
          <Form.Item
            {...itemProps}
            name={name}
            label={floating ? undefined : label}
            rules={rules}
            required={required}
            valuePropName={valuePropName}
          >
            {control}
          </Form.Item>
        );

        return (
          <Col
            key={fieldKey}
            span={span ?? col ?? 24}
            offset={offset ?? colStart}
            className={fieldClassName}
          >
            {floating ? (
              <div className="floating-field">
                <span className="floating-label">
                  {label}
                  {showRequiredMark ? (
                    <span className="floating-label-asterisk" aria-hidden>
                      *
                    </span>
                  ) : null}
                </span>
                <div className="floating-control">{formItem}</div>
              </div>
            ) : (
              formItem
            )}
          </Col>
        );
      })}
    </Row>
  );
}
