import React, { Component } from 'react';
import { Button, Jumbotron, Container, Row, Col, Card , Modal, Form} from 'react-bootstrap';
import Web3 from 'web3'
import './App.css';
import VotoEnchente from "./contracts/VotoEnchente.json";

import moment from 'moment';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      titleAlert: '',
      localAlert: '',
      descriAlert: '',
      voto: 0,
      itensAlerts: [],
      qtdAlerts: 0,
      show: false
    }
  }


  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  handleClose = () => this.setState({show: false});
  handleShow =  () => this.setState({show: true});
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
    console.log (window.web3.currentProvider)
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    console.log('accounts: ', accounts);
    console.log ('account: ', accounts[0])
    this.setState({ account: accounts[0] })
  
    //Verifica qual rede está ativa no web3    
    const networkId = await web3.eth.net.getId()
    console.log ('networkId: ', networkId)
    //Verifica se o smart contract foi publicado nessa rede
    const networkData = VotoEnchente.networks[networkId]
    console.log ('networkData: ', networkData)
    if(networkData) {
      const abi = VotoEnchente.abi
      const address = networkData.address
      console.log ('contract address: ', address)
      const contract = new web3.eth.Contract(abi, address)
      console.log ('contract: ', contract)
      this.setState({ contract })
      // const info = await contract.methods.getAllCodAlerts().call()
      // console.log ('info: ', info)
      //this.setState({ qtdVotos, qtdVotosYes, qtdVotosNot })
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
    setInterval(async () => {
      const qtdAlerts = await this.state.contract.methods.codigo().call()
      console.log ('alertas: ', qtdAlerts)

      console.log('this.state.itensAlerts.length', this.state.itensAlerts.length)
      var count = 0;
      var auxItens = [];
      while(count < qtdAlerts){
        console.log('count:',count)
        let alerta = this.state.contract && await this.state.contract.methods.getAlerta(count).call()

        auxItens.push(await alerta)

        count++;
      }
        auxItens.length > 0 && this.setState({itensAlerts: auxItens})

        console.log ('alertas: ', this.state.itensAlerts)
     }, 5000);
  }

  setVoto = async (cod, newVoto) => {
    console.log ('newInfo: ', newVoto)
    this.state.contract && this.state.contract.methods.setVoto(parseInt(cod),parseInt(newVoto)).send({ from: this.state.account })

    .once('receipt', (receipt) => {
      console.log ('transaction receipt: ', receipt)
      //this.setState({ voto: parseInt(newVoto) })
    })
  } 

  handleEmitirAlerta = async () => {
    //console.log ('newInfo: ', newVoto)
    console.log(this.inputDescri.value, this.inputLocal.value, this.inputTitle.value)
    this.state.contract && 
    this.state.contract.methods.setAlert(this.inputTitle.value , 
                                        this.inputDescri.value, 
                                        this.inputLocal.value,
                                        moment(new Date()).format('DD/MM/yyyy HH:mm'))
                                .send({ from: this.state.account })
                                .once('receipt', async (receipt) => {
                                  console.log ('transaction receipt: ', receipt)
                                    //this.setState({ voto: parseInt(newVoto) })
                                  //var codAlerts = this.state.contract && await this.state.contract.methods.getAllCodAlerts().call()
                                  var alerta = this.state.contract && await this.state.contract.methods.getAlerta(0).call()
                                  var iCod = this.state.contract && await this.state.contract.methods.codigo().call()
                                  //var indexes = this.state.contract && await this.state.contract.methods.indexs(3).call()
                                  //console.log ('info: ', codAlerts)
                                  console.log ('--->iCod: ', iCod)
                                  //console.log ('--->indexs: ', indexes)
                                  console.log (alerta)
                                  console.log (JSON.stringify(alerta))
                                  console.log (JSON.stringify(alerta['descri']))
                                  console.log ('--> alerta[0]: ', JSON.stringify(alerta))
                                    //this.setState({ codAlerts, qtdVotosYes:  alerta[2]})
                                })
        this.handleClose();
  }  

  render() {
    return (

  <Container className="p-3">
    <Jumbotron style={{backgroundImage: 'url(poster4.jpg)', padding: 0}}>
      <Container style={{backgroundColor: 'rgba(196, 196, 196, 0.5)', padding: 50,}}>
      <h1 style={{textShadow: '-5px 5px 10px  white'}}><b>Alertas na cidade</b></h1>
      <p style={{ textShadow: '-5px 5px 10px  black', color: 'lightyellow', fontSize: 20}}>
        Esse é um site, desenvolvido para a população informar e validar um alerta de calamidade pública.
      </p>
      <p>
        <Button onClick={this.handleShow} variant="warning">Adicionar um alerta</Button>
      </p>
      <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Gerando um alerta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Titulo</Form.Label>
                <Form.Control ref={(input) => { this.inputTitle = input }}  onChange={(txt) => {this.setState({titleAlert: txt}); console.log('txt: ', txt.value)}}  type="email" placeholder="Enter email" />
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="formGridAddress1">
              <Form.Label>Local</Form.Label>
              <Form.Control  ref={(input) => { this.inputLocal = input }} onChange={(txt) => {this.setState({localAlert: txt}); console.log('txt: ', txt.value)}}  placeholder="1234 Main St" />
            </Form.Group>

            <Form.Group controlId="formGridAddress2">
              <Form.Label>Descrção</Form.Label>
              <Form.Control ref={(input) => { this.inputDescri = input }}  onChange={(txt) => {this.setState({descriAlert: txt}); console.log('txt: ', txt)}} placeholder="Apartment, studio, or floor" />
            </Form.Group>
        </Form>
         
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={this.handleEmitirAlerta}>
            Emitir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </Jumbotron>
    <Container style={{backgroundColor: 'rgba(0, 0, 0, 0.1)', padding: 30, borderRadius: 5, marginTop: -20}}>
      <Col>
        <h2>Ocorrência de alertas</h2>
      </Col>
      <Col>
        <Row>
          {this.state.itensAlerts.map((alerta) =>
            <Card style={{ width: '18rem', marginRight: 15, boxShadow: '5px 5px 5px grey' }}>
              <Card.Img variant="top" src="alerta.png" style={{padding: 10}}/>
              <Card.Body >
                <Card.Title>{alerta.title}</Card.Title>
                <Card.Text><i>Ocorrido:{ alerta.data_time } </i> </Card.Text>
                <Card.Text style={{marginTop: -8}}><b>Confimações:</b> { alerta.qtdVotosYes } </Card.Text>
                <Card.Text style={{marginTop: -15}}><b>Negações:</b> { alerta.qtdVotosNot }</Card.Text>
                <Card.Text>
                {alerta.descri}
                </Card.Text>
                <div className="View-Btn">
                  <Button onClick={() => this.setVoto(alerta.cod, 1)} variant="success">Verdadeiro</Button>{' '}
                  <Button onClick={() => this.setVoto(alerta.cod, 0)} variant="danger">Falso</Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Row>
      </Col>
    </Container>
    </Container>
      );
    }        
}

export default App;
