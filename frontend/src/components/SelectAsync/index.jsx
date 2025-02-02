import { useState, useEffect, useCallback } from 'react';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import { Select, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { generate as uniqueId } from 'shortid';
import color from '@/utils/color';
import useLanguage from '@/locale/useLanguage';
import useDebounce from '@/hooks/useDebounce';

const SelectAsync = ({
  entity,
  displayLabels = ['name'],
  outputValue = '_id',
  redirectLabel = '',
  withRedirect = false,
  urlToRedirect = '/',
  placeholder = 'select',
  searchFields = [],
  value,
  onChange,
}) => {
  const translate = useLanguage();
  const [selectOptions, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(undefined);
  const [valToSearch, setValToSearch] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  const navigate = useNavigate();

  useDebounce(
    () => {
      setDebouncedValue(valToSearch);
    },
    500,
    [valToSearch]
  );

  // Fetch initial list
  const asyncList = useCallback(() => {
    return request.list({ entity });
  }, [entity]);

  const { result, isLoading: fetchIsLoading, isSuccess } = useFetch(asyncList);

  // Fetch search results
  const asyncSearch = useCallback(() => {
    if (!debouncedValue) return Promise.resolve([]);
    return request.search({
      entity,
      options: {
        q: debouncedValue,
        fields: searchFields,
      },
    });
  }, [debouncedValue, entity, searchFields]);

  const {
    result: searchResult,
    isLoading: isSearchLoading,
    isSuccess: isSearchSuccess,
  } = useFetch(asyncSearch, [debouncedValue]);

  // Combine results based on search state
  useEffect(() => {
    if (debouncedValue) {
      if (isSearchSuccess) {
        setOptions(searchResult);
      }
    } else {
      if (isSuccess) {
        setOptions(result);
      }
    }
  }, [debouncedValue, isSearchSuccess, searchResult, isSuccess, result]);

  const labels = (optionField) => {
    return displayLabels.map((x) => optionField[x]).join(' ');
  };

  // Handle value prop changes
  useEffect(() => {
    if (value !== undefined) {
      const val = value[outputValue] ?? value;
      setCurrentValue(val);
      onChange(val);
    }
  }, [value]);

  const handleSelectChange = (newValue) => {
    if (newValue === 'redirectURL') {
      navigate(urlToRedirect);
    } else {
      const val = newValue[outputValue] ?? newValue;
      setCurrentValue(newValue);
      onChange(val);
    }
  };

  const optionsList = () => {
    const list = [];
    selectOptions.forEach((optionField) => {
      const value = optionField[outputValue] ?? optionField;
      const label = labels(optionField);
      const currentColor = optionField[outputValue]?.color ?? optionField?.color;
      const labelColor = color.find((x) => x.color === currentColor);
      list.push({ value, label, color: labelColor?.color });
    });
    return list;
  };

  return (
    <Select
      showSearch
      filterOption={false}
      onSearch={setValToSearch}
      loading={fetchIsLoading || isSearchLoading}
      disabled={fetchIsLoading || isSearchLoading}
      value={currentValue}
      onChange={handleSelectChange}
      placeholder={translate(placeholder)}
    >
      {optionsList().map((option) => (
        <Select.Option key={`${uniqueId()}`} value={option.value}>
          <Tag bordered={false} color={option.color}>
            {option.label}
          </Tag>
        </Select.Option>
      ))}
      {withRedirect && (
        <Select.Option value="redirectURL">{`+ ${translate(redirectLabel)}`}</Select.Option>
      )}
    </Select>
  );
};

export default SelectAsync;
