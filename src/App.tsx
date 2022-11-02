import { Alert, Button, Col, Form, InputNumber, Layout, Result, Row, Select, Spin, Table, Tabs } from 'antd';
import { Content, Footer } from 'antd/lib/layout/layout';
import { useState } from 'react';
import { condition1, condition2, condition3, generateLCG, ILCG } from './generator/generator';

interface IValidatorResult {
  condition1: boolean;
  condition2: boolean;
  condition3: boolean;
}
const LCG = (a: number, c: number, m: number) => (seed: number) => {
  let currX: number | null = null;
  const next = () => {
    if (!currX) {
      currX = seed;
      return currX;
    }

    currX = (a * currX + c) % m;
    return currX;
  }

  const nextN = (n: number): number[] => {
    const result: number[] = [];
    for (let i = 0; i < n; i++) {
      result.push(next());
    }
    return result;
  }

  return {
    next, nextN
  }
}


const PI_test = (values: number[], M: number) => {
  let ntotal = 0;
  let inCircle = 0;
  let piApprox = 0;
  for (let i = 0; i < values.length; i += 2) {
    const x1 = values[i];
    const y1 = values[i + 1];
    if ((Math.sqrt((x1 / M) * (x1 / M) + (y1 / M) * (y1 / M)) <= 1.0)) inCircle++;
    ntotal++;
  }
  piApprox = 4 * (inCircle / ntotal);
  return (piApprox);
}


const average = (arr: number[]) => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;


function App() {
  const [lcgCount, setLcgCount] = useState(10); // Počet trojic, které chci vygenerovat
  const [lcgParams, setLcgParams] = useState<ILCG[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [validatorResult, setValidatorResult] = useState<IValidatorResult | undefined>(undefined);

  const generateLCGcombinations = (n: number) => async (values: { C?: number, M: number }) => {
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
                    onFinish={generateLCGcombinations(lcgCount)}
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
              <InputNumber />
            </Form.Item>
            <Form.Item rules={[{ required: true }]} label='Parametr C: ' name='C'>
              <InputNumber />
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
      <Table pagination={false} size={'small'} dataSource={lcgParams.map((o, index) => {
        const smallSampleGenerated = LCG(o.A, o.C, o.M)(1).nextN(15);
        const bigSampleGenerated = LCG(o.A, o.C, o.M)(1).nextN(5000);


        return ({ ...o, index: index + 1, generated_values: smallSampleGenerated.join(',') + "...", pi_test: PI_test(bigSampleGenerated, o.M), average_test: `Průměr vzorku je: ${average(bigSampleGenerated)} a měl by být: ${o.M / 2}`  })
      })}>
        <Table.Column key='index' title='ID' dataIndex='index'></Table.Column>
        <Table.Column key='A' title='A' dataIndex='A'></Table.Column>
        <Table.Column key='C' title='C' dataIndex='C'></Table.Column>
        <Table.Column key='M' title='M' dataIndex='M'></Table.Column>
        <Table.Column key='generated_values' title='Generovaný vzorek' dataIndex='generated_values'></Table.Column>
        <Table.Column key='pi_test' title='Monte carlo odhad čísla PI=3,1415926' dataIndex='pi_test'></Table.Column>
        <Table.Column key='average_test' title='Průměr' dataIndex='average_test'></Table.Column>
      </Table>}
  </>
  );
}

export default App;
