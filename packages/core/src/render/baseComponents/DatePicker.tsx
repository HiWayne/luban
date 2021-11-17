import { FunctionComponent, useCallback, useMemo } from 'react';
import { DatePicker as AntdDatePicker, Form } from 'antd';
import { ComponentNames, DatePickerType, PickerType, ComponentLevel, OffsetConst } from 'types/types';
import { definePropertyOfName, convertRelativeToAbsolute, definePropertyOfLevel } from 'utils/index';
import { useTree } from 'hooks/index';

const { RangePicker } = AntdDatePicker;

interface AdvancedDatePickerProps extends CommonProps {
  type: DatePickerType;
  picker: PickerType;
  label?: string;
  rules?: any[];
  labelWidth?: number;
  wrapperOffset?: number;
  required?: boolean;
}

interface BasicDatePickerProps {
  type: DatePickerType;
  picker: PickerType;
  label?: string;
  required?: boolean;
  model?: MaybeHasSubPath;
}

interface DatePickerProps extends BasicDatePickerProps, AdvancedDatePickerProps {}

const DatePicker: FunctionComponent<DatePickerProps> = ({
  type,
  picker,
  label,
  rules,
  labelWidth,
  wrapperOffset,
  topOffset,
  leftOffset,
  state,
  effect,
  model,
  level,
  required,
}) => {
  const { handleModelChange, handleStateChange, isShow } = useTree({ state, effect, model });

  const ANTD_DATE_PICKER = useMemo(() => {
    switch (type) {
      case DatePickerType.DATE:
        return AntdDatePicker;
      case DatePickerType.RANGE:
        return RangePicker;
      default:
        return AntdDatePicker;
    }
  }, [type]);

  const props = useMemo(() => {
    switch (picker) {
      case PickerType.TIME:
        return { showTime: true };
      case PickerType.DAY:
        return {};
      case PickerType.WEEK:
      case PickerType.MONTH:
      case PickerType.YEAR:
        return { picker };
      default:
        return {};
    }
  }, [picker]);

  const handleChange = useCallback(
    (times) => {
      const startTime = times && times[0] && new Date(times[0]).getTime();
      const endTime = times && times[1] && new Date(times[1]).getTime();
      if (model && model[0] && model[1]) {
        handleModelChange(startTime, (model as Path[])[0]);
        handleModelChange(endTime, (model as Path[])[1]);
      }
      if (model && model[0]) {
        handleStateChange(startTime, (model as Path[])[0]);
      }
      if (model && model[1]) {
        handleStateChange(endTime, (model as Path[])[1]);
      }
    },
    [model, handleStateChange, handleModelChange],
  );
  switch (level) {
    case ComponentLevel.BASIC:
      return isShow ? (
        <Form.Item
          label={label}
          rules={[{ required: !!required }]}
          style={{
            marginTop: convertRelativeToAbsolute(OffsetConst.TOP_OFFSET),
            marginLeft: convertRelativeToAbsolute(OffsetConst.LEFT_OFFSET),
          }}
        >
          <ANTD_DATE_PICKER {...props} onChange={handleChange} />
        </Form.Item>
      ) : null;

    case ComponentLevel.ADVANCED:
      return isShow ? (
        <Form.Item
          label={label}
          rules={rules}
          labelCol={{ span: labelWidth }}
          wrapperCol={{ offset: wrapperOffset }}
          style={{ marginTop: convertRelativeToAbsolute(topOffset), marginLeft: convertRelativeToAbsolute(leftOffset) }}
        >
          <ANTD_DATE_PICKER {...props} onChange={handleChange} />
        </Form.Item>
      ) : null;
    default:
      return null;
  }
};

definePropertyOfName(DatePicker, ComponentNames.DATEPICKER);
definePropertyOfLevel(DatePicker, [ComponentLevel.BASIC, ComponentLevel.ADVANCED]);

export default DatePicker;
