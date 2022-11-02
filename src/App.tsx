import { Alert, Button, Checkbox, Col, Form, Input, InputNumber, Layout, List, Progress, Result, Row, Select, Spin, Table, Tabs } from 'antd';
import { Content, Footer } from 'antd/lib/layout/layout';
import React, { useState } from 'react';
import { condition1, condition2, condition3, generateLCG, ILCG } from './generator/generator';

interface IValidatorResult {
  condition1: boolean;
  condition2: boolean;
  condition3: boolean;
}

function App() {
  const [lcgCount, setLcgCount] = useState(5);
  const [lcgParams, setLcgParams] = useState<ILCG[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [validatorResult, setValidatorResult] = useState<IValidatorResult | undefined>(undefined);

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
      <Tabs>
        <Tabs.TabPane tab="LCG generátor" key="tab-1">
          <Content>
            <Spin spinning={isGenerating} delay={0}>
              <Row>
                <Col span={12} offset={6}>
                  Vstupní parametry LCG generátoru.
                  <Form
                    onFinish={generate(lcgCount)}
                    name="generator"
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

                    <Form.Item label="M:" name="M" rules={[{ required: true }]} initialValue={2 ** 32}>
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
        </Tabs.TabPane>
        <Tabs.TabPane tab="LCG validátor" key="tab-2">
          Zkontrolujte, že zadané parametry vyhovují podmínkám dobrého Lineárního kongruentního generátoru.
          <Form
            onFinish={(values: ILCG) => {
              console.log(values);
              console.log(values.C);
              console.log(values.M);
              console.log(condition1(values.C, values.M));

              setValidatorResult(
                {
                  condition1: condition1(values.C, values.M),
                  condition2: condition2(values.A, values.M),
                  condition3: condition3(values.A, values.M),
                }
              )
            }}

            name="validator"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item rules={[{ required: true }]} label='Parametr A: ' name='A'>
              <InputNumber  />
            </Form.Item>
            <Form.Item rules={[{ required: true }]} label='Parametr C: ' name='C'>
              <InputNumber  />
            </Form.Item>
            <Form.Item rules={[{ required: true }]} label='Parametr M: ' name='M'>
              <InputNumber />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Zkontroluj
            </Button>

            {validatorResult && <>
              <Row>
                <Col span={8}>
                <Result title='C a M jsou nesoudělná čísla' status={validatorResult.condition1 ? 'success' : 'error'}></Result>
                </Col>
                <Col span={8}>
                <Result title='A-1 je dělitelné všemi prvočíselnými faktory M' status={validatorResult.condition2 ? 'success' : 'error'}></Result>
                </Col>
                <Col span={8}>
                <Result title='Když M je násobek 4, tak A-1 taky' status={validatorResult.condition3 ? 'success' : 'error'}></Result>
                </Col>
              </Row>
              <Row>
                  <Col span={8} offset={8} >
                  <Result 
                    title='A, C, M dohromady tvoří dobrý lineární kongruentní generátor.'
                    status={(validatorResult.condition1 && validatorResult.condition2 && validatorResult.condition3) ? 'success' : 'error'}></Result>
                  </Col>
                </Row>
            </>}

          </Form>
        </Tabs.TabPane>
      </Tabs>
      <Footer>
      </Footer>
    </Layout>
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
