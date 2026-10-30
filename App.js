import React, {
  useState,
  useEffect,
  createContext,
  useContext,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// --------------------------------------------------
// CONTEXTO E ARMAZENAMENTO
// --------------------------------------------------

const CandidatosContext = createContext(null);

function useCandidatos() {
  return useContext(CandidatosContext);
}

const CHAVE_STORAGE = '@cadastro_candidatos';

// --------------------------------------------------
// TELA INICIAL
// --------------------------------------------------

function TelaInicio() {
  const { candidatos } = useCandidatos();

  return (
    <View style={styles.container}>
      <Text style={styles.etiqueta}>
        GESTÃO DE TALENTOS
      </Text>

      <Text style={styles.titulo}>
        Cadastro de Candidatos
      </Text>

      <Text style={styles.descricao}>
        Organize seus contatos profissionais e acesse
        os perfis do LinkedIn em um só lugar.
      </Text>

      <View style={styles.cartao}>
        <Text style={styles.numero}>
          {candidatos.length}
        </Text>

        <Text style={styles.textoCartao}>
          Candidatos cadastrados
        </Text>
      </View>
    </View>
  );
}

// --------------------------------------------------
// TELA DE CADASTRO E EDIÇÃO
// --------------------------------------------------

function TelaCadastro({ route, navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');

  const {
    candidatos,
    adicionarCandidato,
    atualizarCandidato,
  } = useCandidatos();

  const candidatoId = route?.params?.id;

  // Se houver um ID na rota, carrega os dados para edição.
  useEffect(() => {
    if (candidatoId) {
      const candidato = candidatos.find(
        (item) => item.id === candidatoId
      );

      if (candidato) {
        setNome(candidato.nome);
        setEmail(candidato.email);
        setLinkedin(candidato.linkedin);
        setFotoUrl(candidato.fotoUrl || '');
      }
    } else {
      setNome('');
      setEmail('');
      setLinkedin('');
      setFotoUrl('');
    }

    setErro('');
    setSucesso('');
  }, [candidatoId, candidatos]);

  function cadastrar() {
    setErro('');
    setSucesso('');

    // Verifica se todos os campos foram preenchidos.
    if (
      nome.trim() === '' ||
      email.trim() === '' ||
      linkedin.trim() === ''
    ) {
      setErro('Preencha todos os campos.');
      return;
    }

    // Valida o formato do e-mail.
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email.trim()
    );

    if (!emailValido) {
      setErro('Informe um endereço de e-mail válido.');
      return;
    }

    // Valida o endereço do LinkedIn.
    try {
      const url = new URL(linkedin.trim());

      const dominioValido =
        url.protocol === 'https:' &&
        (
          url.hostname === 'linkedin.com' ||
          url.hostname.endsWith('.linkedin.com')
        );

      if (!dominioValido) {
        setErro('Informe uma URL válida do LinkedIn.');
        return;
      }
    } catch {
      setErro('Informe uma URL válida do LinkedIn.');
      return;
    }

    const dadosCandidato = {
      nome: nome.trim(),
      email: email.trim(),
      linkedin: linkedin.trim(),
      fotoUrl: fotoUrl.trim(),
    };

    if (candidatoId) {
      // Atualiza o candidato existente.
      atualizarCandidato(candidatoId, dadosCandidato);
    } else {
      // Cadastra um novo candidato.
      adicionarCandidato(dadosCandidato);
    }

    // Limpa os campos e remove o ID da rota.
    setNome('');
    setEmail('');
    setLinkedin('');
    setFotoUrl('');
    navigation.setParams({ id: undefined });

    // Retorna para a listagem.
    navigation.navigate('Candidatos');
  }

  function limpar() {
    setNome('');
    setEmail('');
    setLinkedin('');
    setErro('');
    setSucesso('');
  }

  return (
    <ScrollView contentContainerStyle={styles.formulario}>
      <Text style={styles.titulo}>
        {candidatoId ? 'Editar candidato' : 'Cadastrar candidato'}
      </Text>

      <Text style={styles.descricao}>
        {candidatoId
          ? 'Altere os dados do candidato.'
          : 'Preencha os dados para cadastrar um novo candidato.'}
      </Text>

      <Text style={styles.rotulo}>Nome completo</Text>
      <TextInput
        style={styles.campo}
        placeholder="Digite o nome completo"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.rotulo}>E-mail</Text>
      <TextInput
        style={styles.campo}
        placeholder="Digite o e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.rotulo}>LinkedIn</Text>
      <TextInput
        style={styles.campo}
        placeholder="https://www.linkedin.com/in/seu-perfil"
        value={linkedin}
        onChangeText={setLinkedin}
        keyboardType="url"
        autoCapitalize="none"
      />

      <Text style={styles.rotulo}>URL da foto</Text>
      <TextInput
        style={styles.campo}
        placeholder="https://site.com/foto.jpg"
        value={fotoUrl}
        onChangeText={setFotoUrl}
        keyboardType="url"
        autoCapitalize="none"
      />

      <Text style={styles.ajuda}>
        Informe o endereço direto da imagem. Este campo é opcional.
      </Text>
      

      <Text style={styles.ajuda}>
        Informe o endereço do seu perfil no LinkedIn.
      </Text>

      {erro !== '' && (
        <Text style={styles.erro} accessibilityRole="alert">
          {erro}
        </Text>
      )}

      {sucesso !== '' && (
        <Text style={styles.sucesso} accessibilityRole="alert">
          {sucesso}
        </Text>
      )}

      <Pressable
        style={styles.botao}
        onPress={cadastrar}
      >
        <Text style={styles.textoBotao}>
          {candidatoId ? 'Salvar alterações' : 'Cadastrar'}
        </Text>
      </Pressable>

      <Pressable
        style={styles.botaoSecundario}
        onPress={limpar}
      >
        <Text style={styles.textoBotaoSecundario}>
          Limpar campos
        </Text>
      </Pressable>
    </ScrollView>
  );
}

// --------------------------------------------------
// TELA DE CANDIDATOS (LISTAGEM)
// --------------------------------------------------

function TelaCandidatos({ navigation }) {
  const { candidatos, excluirCandidato } = useCandidatos();

  return (
    <ScrollView contentContainerStyle={styles.formulario}>
      <Text style={styles.titulo}>
        Candidatos cadastrados
      </Text>

      <Text style={styles.descricao}>
        Consulte os candidatos registrados na aplicação.
      </Text>

      {candidatos.length === 0 ? (
        <View style={styles.cartaoVazio}>
          <Text style={styles.mensagemVazia}>
            Nenhum candidato cadastrado.
          </Text>

          <Pressable
            style={styles.botao}
            onPress={() => navigation.navigate('Cadastro')}
          >
            <Text style={styles.textoBotao}>
              Cadastrar candidato
            </Text>
          </Pressable>
        </View>
      ) : (
        candidatos.map((candidato) => (
          <View
            key={candidato.id}
            style={styles.cartaoCandidato}
          >
            {candidato.fotoUrl ? (
              <Image
                source={{ uri: candidato.fotoUrl }}
                style={styles.fotoCandidato}
                resizeMode="cover"
              />
            ) : null}

            <Text style={styles.nomeCandidato}>
              {candidato.nome}
            </Text>

            <Text style={styles.detalheCandidato}>
              E-mail: {candidato.email}
            </Text>

            <Text style={styles.detalheCandidato}>
              LinkedIn:
            </Text>

            <Text
              style={styles.linkCandidato}
              onPress={() => {
                if (typeof window !== 'undefined') {
                  window.open(
                    candidato.linkedin,
                    '_blank',
                    'noopener,noreferrer'
                  );
                }
              }}
              accessibilityRole="link"
            >
              {candidato.linkedin}
            </Text>

            <Pressable
              style={styles.botao}
              onPress={() =>
                navigation.navigate('Cadastro', {
                  id: candidato.id,
                })
              }
            >
              <Text style={styles.textoBotao}>
                Editar candidato
              </Text>
            </Pressable>
            <Pressable
              style={styles.botaoExcluir}
              onPress={() => {
                const confirmar = window.confirm(
                  `Deseja realmente excluir o candidato ${candidato.nome}?`
                );

                if (confirmar) {
                  excluirCandidato(candidato.id);
                }
              }}
            >
              <Text style={styles.textoBotaoExcluir}>
                Excluir candidato
              </Text>
            </Pressable>          
          </View>
        ))
      )}
    </ScrollView>
  );
}

// --------------------------------------------------
// NAVEGAÇÃO E COMPONENTE PRINCIPAL
// --------------------------------------------------

const Tab = createBottomTabNavigator();

export default function App() {
  const [candidatos, setCandidatos] = useState(() => {
    try {
      if (typeof window === 'undefined') {
        return [];
      }

      const dados = window.localStorage.getItem(CHAVE_STORAGE);
      return dados ? JSON.parse(dados) : [];
    } catch (erro) {
      console.error('Erro ao carregar candidatos:', erro);
      return [];
    }
  });

  // Persiste a lista sempre que ela for modificada.
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(
          CHAVE_STORAGE,
          JSON.stringify(candidatos)
        );
      }
    } catch (erro) {
      console.error('Erro ao salvar candidatos:', erro);
    }
  }, [candidatos]);

  function adicionarCandidato(novoCandidato) {
    setCandidatos((listaAtual) => [
      ...listaAtual,
      {
        id: Date.now().toString(),
        ...novoCandidato,
      },
    ]);
  }

  function atualizarCandidato(id, dadosAtualizados) {
    setCandidatos((listaAtual) =>
      listaAtual.map((candidato) =>
        candidato.id === id
          ? { ...candidato, ...dadosAtualizados }
          : candidato
      )
    );
  }

  function excluirCandidato(id) {
  setCandidatos((listaAtual) =>
      listaAtual.filter((candidato) => candidato.id !== id)
    );
  }

  return (
    <CandidatosContext.Provider
      value={{
        candidatos,
        setCandidatos,
        adicionarCandidato,
        atualizarCandidato,
         excluirCandidato,
      }}
    >
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#ffffff',
            },
            headerTintColor: '#0f172a',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarActiveTintColor: '#0a66c2',
            tabBarInactiveTintColor: '#64748b',
            tabBarLabelStyle: {
              fontSize: 13,
              fontWeight: '600',
            },
            tabBarStyle: {
              height: 65,
              paddingBottom: 8,
              paddingTop: 6,
            },
          }}
        >
          <Tab.Screen
            name="Inicio"
            component={TelaInicio}
            options={{
              title: 'Início',
              tabBarLabel: 'Início',
              tabBarIcon: ({ color }) => (
                <Text style={{ color, fontSize: 20 }}>⌂</Text>
              ),
            }}
          />

          <Tab.Screen
            name="Cadastro"
            component={TelaCadastro}
            options={{
              title: 'Cadastrar candidato',
              tabBarLabel: 'Cadastrar',
              tabBarIcon: ({ color }) => (
                <Text style={{ color, fontSize: 20 }}>＋</Text>
              ),
            }}
          />

          <Tab.Screen
            name="Candidatos"
            component={TelaCandidatos}
            options={{
              title: 'Candidatos cadastrados',
              tabBarLabel: 'Candidatos',
              tabBarIcon: ({ color }) => (
                <Text style={{ color, fontSize: 20 }}>☷</Text>
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </CandidatosContext.Provider>
  );
}

// --------------------------------------------------
// ESTILOS
// --------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0a66c2',
    marginBottom: 15,
    textAlign: 'center',
  },

  descricao: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
  },

  etiqueta: {
    color: '#0a66c2',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 10,
  },

  cartao: {
    width: '100%',
    backgroundColor: '#e8f2fc',
    padding: 22,
    borderRadius: 12,
    marginTop: 25,
    marginBottom: 25,
  },

  numero: {
    color: '#0a66c2',
    fontSize: 36,
    fontWeight: 'bold',
  },

  textoCartao: {
    color: '#334155',
    fontSize: 15,
  },

  botao: {
    width: '100%',
    backgroundColor: '#0a66c2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 12,
  },

  textoBotao: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  botaoSecundario: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#94a3b8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },

  textoBotaoSecundario: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: 'bold',
  },

  formulario: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    padding: 20,
    backgroundColor: '#f1f5f9',
  },

  rotulo: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 15,
  },

  campo: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 8,
    padding: 13,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },

  ajuda: {
    color: '#475569',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 15,
  },

  erro: {
    color: '#b91c1c',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 12,
  },

  sucesso: {
    color: '#15803d',
    backgroundColor: '#dcfce7',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    textAlign: 'center',
  },

  cartaoVazio: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },

  mensagemVazia: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },

  cartaoCandidato: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  nomeCandidato: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },

  detalheCandidato: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 6,
  },

  linkCandidato: {
    fontSize: 14,
    color: '#2563eb',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },

  botaoExcluir: {
    width: '100%',
    backgroundColor: '#dc2626',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 12,
  },

  textoBotaoExcluir: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  fotoCandidato: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: '#e5e7eb',
  },  

});