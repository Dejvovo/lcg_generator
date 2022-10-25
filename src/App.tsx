import { Alert, Button, Checkbox, Col, Form, Input, InputNumber, Layout, List, Progress, Row, Select, Spin, Table } from 'antd';
import { Content, Footer } from 'antd/lib/layout/layout';
import React, { useState } from 'react';
import { generateLCG, ILCG } from './generator/generator';


function App() {
  const [lcgCount, setLcgCount] = useState(5);
  const [lcgParams, setLcgParams] = useState<ILCG[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generate = (n: number) => async (values: { C?: number, M: number }) => {
    setLcgParams([]);
    setErrorMessage('');
    setIsGenerating(true);

    try {
      for (let i = 0; i < n; i++) {
        const lcg = generateLCG(undefined, values.C, values.M);
        setLcgParams((prev) => [...prev, lcg]);
        console.log(lcgParams);
      }
    } catch (e) {
      if (e instanceof Error) setErrorMessage(e.message)
    }

    setIsGenerating(false);
  }


  return (<>
    <Layout>
      <Content>
        <Spin spinning={isGenerating} delay={0}>
          <Row>
            <Col span={12} offset={6}>
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
                    validator(_, val: number) {
                      if (!val || (val > 0 && val % 2 !== 0)) return Promise.resolve();
                      return Promise.reject("C musí být liché číslo větší než 0.")
                    },
                    message: "C musí být liché číslo větší než 0."
                  })]}
                  initialValue={12345}
                >
                  <InputNumber />
                </Form.Item>

                <Form.Item label="M:" name="M" rules={[{ required: true }]} initialValue={2**32}>
                  <Select>
                    <Select.Option value={2 ** 16}>2**16</Select.Option>
                    <Select.Option value={2 ** 24}>2**24</Select.Option>
                    <Select.Option value={2 ** 31}>2**31</Select.Option>
                    <Select.Option value={2 ** 32}>2**32</Select.Option>
                  </Select>
                </Form.Item>


                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Button type="primary" htmlType="submit">
                    Generuj
                  </Button>
                </Form.Item>
              </Form>

            </Col>
          </Row>
        </Spin>

      </Content>
      <Footer>
      </Footer>
    </Layout>
    <Progress percent={(lcgParams.length / lcgCount) * 100}></Progress>
    {errorMessage && <Alert message={errorMessage} type="error" />}

    {lcgParams.length > 0 &&
      <Table size={'small'} dataSource={lcgParams.map((o, index) => ({ ...o, index: index + 1 }))}>
        <Table.Column key='index' title='ID' dataIndex='index'></Table.Column>
        <Table.Column key='A' title='A' dataIndex='A'></Table.Column>
        <Table.Column key='C' title='C' dataIndex='C'></Table.Column>
        <Table.Column key='M' title='M' dataIndex='M'></Table.Column>
      </Table>}
  </>
  );
}

export default App;
