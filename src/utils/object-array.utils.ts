import {
  DataMap,
  IdLabelType,
  ValueLabelType,
} from 'src/transport/events/events.dto';

export const convertObjectMapToMenuItemsArray = (
  dataMap: DataMap
): IdLabelType[] => {
  return Object.entries(dataMap).map(([id, label]) => ({
    id,
    label,
  }));
};

export const convertObjectMapToDropdownOptionsArray = (
  dataMap: DataMap
): ValueLabelType[] => {
  return Object.entries(dataMap).map(([key, value]) => ({
    label: value,
    value: key,
  }));
};
