import { Form, Input, Select } from 'antd';
import { DatePicker } from 'antd';
import { validatePhoneNumber } from '@/utils/helpers';
import { useDate } from '@/settings';

import useLanguage from '@/locale/useLanguage';

export default function EmployeeForm() {
  const translate = useLanguage();
  const { dateFormat } = useDate();

  return (
    <>
      <Form.Item
        name="firstname"
        label={translate('first name')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="lastname"
        label={translate('last name')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="birthday"
        label={translate('birthday')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <DatePicker placeholder={translate('select_date')} format={dateFormat} />
      </Form.Item>
      <Form.Item
        name="birthplace"
        label={translate('birthplace')}
        rules={[
          {
            required: false,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="gender"
        label={translate('gender')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select>
          <Select.Option value="male">{translate('male')}</Select.Option>
          <Select.Option value="female">{translate('female')}</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="email"
        label={translate('email')}
        rules={[
          {
            type: 'email',
          },
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label={translate('phone')}
        rules={[
          {
            required: false,
          },
          {
            pattern: validatePhoneNumber, // importing regex from helper.js utility file to validate
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="department"
        label={translate('Department')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="position"
        label={translate('Position')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label={translate('Address')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="state"
        label={translate('State')}
        rules={[
          {
            required: false,
          },
        ]}
      >
        <Input />
      </Form.Item>
    </>
  );
}
// import { Form, Input, Select } from 'antd';
// import { DatePicker } from 'antd';
// import { validatePhoneNumber } from '@/utils/helpers';
// import { useDate } from '@/settings';

// import useLanguage from '@/locale/useLanguage';

// export default function EmployeeForm({ isUpdateForm = false, initialValues = {} }) {
//   const translate = useLanguage();
//   const { dateFormat } = useDate();

//   return (
//     <>
//       <Form initialValues={isUpdateForm ? initialValues : {}}>
//         <Form.Item
//           name="firstname"
//           label={translate('first name')}
//           rules={[
//             {
//               required: true,
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="lastname"
//           label={translate('last name')}
//           rules={[
//             {
//               required: true,
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="birthday"
//           label={translate('birthday')}
//           rules={[
//             {
//               required: true,
//             },
//           ]}
//         >
//           <DatePicker
//             placeholder={translate('select_date')}
//             format={dateFormat}
//             value={isUpdateForm ? initialValues.birthday : null}
//           />
//         </Form.Item>
//         <Form.Item
//           name="birthplace"
//           label={translate('birthplace')}
//           rules={[
//             {
//               required: false,
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="gender"
//           label={translate('gender')}
//           rules={[
//             {
//               required: true,
//             },
//           ]}
//         >
//           <Select>
//             <Select.Option value="male">{translate('male')}</Select.Option>
//             <Select.Option value="female">{translate('female')}</Select.Option>
//           </Select>
//         </Form.Item>
//         <Form.Item
//           name="email"
//           label={translate('email')}
//           rules={[
//             {
//               type: 'email',
//             },
//             {
//               required: true,
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="phone"
//           label={translate('phone')}
//           rules={[
//             {
//               required: false,
//             },
//             {
//               pattern: validatePhoneNumber, // importing regex from helper.js utility file to validate
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="department"
//           label={translate('Department')}
//           rules={[
//             {
//               required: true,
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="position"
//           label={translate('Position')}
//           rules={[
//             {
//               required: true,
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="address"
//           label={translate('Address')}
//           rules={[
//             {
//               required: true,
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//         <Form.Item
//           name="state"
//           label={translate('State')}
//           rules={[
//             {
//               required: false,
//             },
//           ]}
//         >
//           <Input />
//         </Form.Item>
//       </Form>
//     </>
//   );
// }
