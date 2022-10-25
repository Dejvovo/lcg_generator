import { Button, Checkbox, Col, Form, Input, InputNumber, Layout, List, Progress, Row, Select } from 'antd';
import { Content, Footer } from 'antd/lib/layout/layout';
import React, { useState } from 'react';
import { generateLCG } from './generator/generator';

function App() {
  const [lcgCount, setLcgCount] = useState(5);
  const [lcgParams, setLcgParams] = useState<string[]>([]);

  const generate = (n: number) => (values: {C? : number, M: number}) => {
    setLcgParams([]);

    for(let i = 0; i< n; i++) {
      const lcg = generateLCG(undefined, values.C, values.M);
      setLcgParams((prev) => [...prev, JSON.stringify(lcg)]);
      console.log(lcgParams);
    }
  }


  return (<>
    <Layout><Content>
      <Row><Col span={12} offset={6}>
        Vstupní parametry LCG generátoru.
        <Form
          onFinish={generate(lcgCount)}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            help="Pokud se C nevyplní, bude vygenerováno:"
            label="C: "
            name="C"
            rules={[() => ({
              validator(_, val: number){
                if(!val || (val > 0 && val % 2 !== 0)) return Promise.resolve();
                return Promise.reject("C musí být liché číslo větší než 0.")
              },
              message: "C musí být liché číslo větší než 0."
            })]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item label="M:" name="M" rules={[{ required: true }]}>
          <Select>
            <Select.Option value={2**16}>2**16</Select.Option>
            <Select.Option value={2**24}>2**24</Select.Option>
            <Select.Option value={2**32}>2**32</Select.Option>
          </Select>
          </Form.Item>


          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Generuj
            </Button>
          </Form.Item>
        </Form>

      </Col></Row>   </Content>
      <Footer>
      </Footer></Layout>
      <Progress percent={(lcgParams.length / lcgCount)*100}></Progress>

      <List>
            {lcgParams.map((lcgParam) => <List.Item>{lcgParam}</List.Item>)}
        </List>

  </>
  );
}

export default App;
