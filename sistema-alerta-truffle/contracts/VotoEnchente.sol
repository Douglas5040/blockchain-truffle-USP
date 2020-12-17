pragma solidity 0.5.4;

contract VotoEnchente {
    uint public codigo=0;
    //uint[] public indexs;

    
    struct Alerta{
                        uint cod;
                        string title;
                        string descri;
                        string local;
                        string data_time;
                        uint  qtdVotosYes;
                        uint  qtdVotosNot;
                        uint  qtdVotos;

                    }
    Alerta[] private alertas;

    function setAlert(string memory  _title, string memory  _descri, string memory  _local, string memory  _data_time ) public {
        
        alertas.push(Alerta({
            cod: codigo,
            title: _title, 
            descri: _descri,
            local: _local,
            data_time: _data_time,
            qtdVotosYes: 1,
            qtdVotosNot: 0,
            qtdVotos: 1
        }));
        //indexs.push(codigo);
        codigo = codigo + 1;
    }

    function setVoto(uint cod, uint _voto) public {
        for (uint i = 0; i < alertas.length; i++) {
            if(alertas[i].cod == cod)
                if(_voto == 0){
                    alertas[i].qtdVotosNot = alertas[i].qtdVotosNot + 1;
                }else {
                    alertas[i].qtdVotosYes = alertas[i].qtdVotosYes + 1;
                }
                alertas[i].qtdVotos = alertas[i].qtdVotos + 1;
        }
    }
    
    function getAlerta(uint index) public view
        returns (uint cod, string memory title, string memory descri, string memory data_time,  
                string memory local, uint qtdVotosYes, uint qtdVotosNot, uint qtdVotos) {
        
            cod = alertas[index].cod;
            title = alertas[index].title;
            descri = alertas[index].descri;
            local = alertas[index].local;
            qtdVotosYes = alertas[index].qtdVotosYes;
            qtdVotosNot = alertas[index].qtdVotosNot;
            qtdVotos = alertas[index].qtdVotos;
            data_time = alertas[index].data_time;
        }
    
}