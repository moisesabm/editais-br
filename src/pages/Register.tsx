import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Mail, Lock, Eye, EyeOff, FileText, User, Phone, MapPin, 
  Calendar, Building2, FileCheck, Upload, Camera 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RegisterDataPessoaFisica, RegisterDataPessoaJuridica } from '../types';
import './Auth.css';

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'fisica' | 'juridica'>('fisica');
  const { registerPessoaFisica, registerPessoaJuridica } = useAuth();
  const navigate = useNavigate();

  const { 
    register: registerFisica, 
    handleSubmit: handleSubmitFisica, 
    formState: { errors: errorsFisica },
    watch: watchFisica 
  } = useForm<RegisterDataPessoaFisica>();

  const { 
    register: registerJuridica, 
    handleSubmit: handleSubmitJuridica, 
    formState: { errors: errorsJuridica },
    watch: watchJuridica 
  } = useForm<RegisterDataPessoaJuridica>();

  const passwordFisica = watchFisica('senha');
  const passwordJuridica = watchJuridica('senha');

  const onSubmitFisica = async (data: RegisterDataPessoaFisica) => {
    setIsLoading(true);
    try {
      await registerPessoaFisica(data);
      navigate('/');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert('Erro ao realizar cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitJuridica = async (data: RegisterDataPessoaJuridica) => {
    setIsLoading(true);
    try {
      await registerPessoaJuridica(data);
      navigate('/');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      alert('Erro ao realizar cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: '600px' }}>
          <div className="auth-header">
            <div className="auth-logo">
              <FileText size={40} className="auth-logo-icon" />
              <div className="auth-logo-text">
                <span className="logo-main">EDITAIS</span>
                <span className="logo-sub">BR</span>
              </div>
            </div>
            <h1 className="auth-title">Crie sua conta</h1>
            <p className="auth-subtitle">Escolha o tipo de cadastro</p>
          </div>

          <div className="register-tabs">
            <button
              className={`tab-button ${activeTab === 'fisica' ? 'active' : ''}`}
              onClick={() => setActiveTab('fisica')}
            >
              <User size={18} />
              Pessoa Física
            </button>
            <button
              className={`tab-button ${activeTab === 'juridica' ? 'active' : ''}`}
              onClick={() => setActiveTab('juridica')}
            >
              <Building2 size={18} />
              Pessoa Jurídica
            </button>
          </div>

          {activeTab === 'fisica' ? (
            <form onSubmit={handleSubmitFisica(onSubmitFisica)} className="auth-form">
              <div className="form-section">
                <h3 className="form-section-title">Dados Pessoais</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-input"
                      {...registerFisica('nome', { required: 'Nome é obrigatório' })}
                    />
                    {errorsFisica.nome && <span className="form-error">{errorsFisica.nome.message}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Sobrenome</label>
                    <input
                      type="text"
                      className="form-input"
                      {...registerFisica('sobrenome', { required: 'Sobrenome é obrigatório' })}
                    />
                    {errorsFisica.sobrenome && <span className="form-error">{errorsFisica.sobrenome.message}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">CPF</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="000.000.000-00"
                      {...registerFisica('cpf', { required: 'CPF é obrigatório' })}
                    />
                    {errorsFisica.cpf && <span className="form-error">{errorsFisica.cpf.message}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Telefone</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="(00) 00000-0000"
                      {...registerFisica('telefone', { required: 'Telefone é obrigatório' })}
                    />
                    {errorsFisica.telefone && <span className="form-error">{errorsFisica.telefone.message}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Data de Nascimento</label>
                    <input
                      type="date"
                      className="form-input"
                      {...registerFisica('dataNascimento', { required: 'Data de nascimento é obrigatória' })}
                    />
                    {errorsFisica.dataNascimento && <span className="form-error">{errorsFisica.dataNascimento.message}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Estado Civil</label>
                    <select
                      className="form-input"
                      {...registerFisica('estadoCivil', { required: 'Estado civil é obrigatório' })}
                    >
                      <option value="">Selecione</option>
                      <option value="solteiro">Solteiro(a)</option>
                      <option value="casado">Casado(a)</option>
                      <option value="divorciado">Divorciado(a)</option>
                      <option value="viuvo">Viúvo(a)</option>
                    </select>
                    {errorsFisica.estadoCivil && <span className="form-error">{errorsFisica.estadoCivil.message}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Sexo</label>
                  <select
                    className="form-input"
                    {...registerFisica('sexo', { required: 'Sexo é obrigatório' })}
                  >
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                  {errorsFisica.sexo && <span className="form-error">{errorsFisica.sexo.message}</span>}
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Endereço</h3>
                
                <div className="form-row">
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Rua</label>
                    <input
                      type="text"
                      className="form-input"
                      {...registerFisica('endereco.rua', { required: 'Rua é obrigatória' })}
                    />
                    {errorsFisica.endereco?.rua && <span className="form-error">{errorsFisica.endereco.rua.message}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Número</label>
                    <input
                      type="text"
                      className="form-input"
                      {...registerFisica('endereco.numero', { required: 'Número é obrigatório' })}
                    />
                    {errorsFisica.endereco?.numero && <span className="form-error">{errorsFisica.endereco.numero.message}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Complemento</label>
                    <input
                      type="text"
                      className="form-input"
                      {...registerFisica('endereco.complemento')}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Bairro</label>
                    <input
                      type="text"
                      className="form-input"
                      {...registerFisica('endereco.bairro', { required: 'Bairro é obrigatório' })}
                    />
                    {errorsFisica.endereco?.bairro && <span className="form-error">{errorsFisica.endereco.bairro.message}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">CEP</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="00000-000"
                      {...registerFisica('endereco.cep', { required: 'CEP é obrigatório' })}
                    />
                    {errorsFisica.endereco?.cep && <span className="form-error">{errorsFisica.endereco.cep.message}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-input"
                      {...registerFisica('endereco.estado', { required: 'Estado é obrigatório' })}
                    >
                      <option value="">Selecione</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="ES">Espírito Santo</option>
                    </select>
                    {errorsFisica.endereco?.estado && <span className="form-error">{errorsFisica.endereco.estado.message}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Cidade</label>
                    <input
                      type="text"
                      className="form-input"
                      {...registerFisica('endereco.cidade', { required: 'Cidade é obrigatória' })}
                    />
                    {errorsFisica.endereco?.cidade && <span className="form-error">{errorsFisica.endereco.cidade.message}</span>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Dados de Acesso</h3>
                
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    {...registerFisica('email', { 
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                  />
                  {errorsFisica.email && <span className="form-error">{errorsFisica.email.message}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Senha</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-input"
                        {...registerFisica('senha', { 
                          required: 'Senha é obrigatória',
                          minLength: {
                            value: 6,
                            message: 'Senha deve ter no mínimo 6 caracteres'
                          }
                        })}
                      />
                      <button
                        type="button"
                        className="input-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errorsFisica.senha && <span className="form-error">{errorsFisica.senha.message}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Confirmar Senha</label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-input"
                        {...registerFisica('confirmarSenha', { 
                          required: 'Confirmação de senha é obrigatória',
                          validate: value => value === passwordFisica || 'As senhas não correspondem'
                        })}
                      />
                      <button
                        type="button"
                        className="input-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errorsFisica.confirmarSenha && <span className="form-error">{errorsFisica.confirmarSenha.message}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Você irá publicar editais?</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" value="true" {...registerFisica('publicaEditais')} />
                      Sim
                    </label>
                    <label className="radio-label">
                      <input type="radio" value="false" {...registerFisica('publicaEditais')} />
                      Não
                    </label>
                  </div>
                </div>
              </div>

              <div className="terms-checkbox">
                <input 
                  type="checkbox" 
                  id="terms"
                  {...registerFisica('aceitePolitica', { required: 'Você deve aceitar a política de uso' })}
                />
                <label htmlFor="terms" className="terms-text">
                  Li e aceito a <a href="#">Política de Uso</a> e os <a href="#">Termos de Serviço</a>
                </label>
              </div>
              {errorsFisica.aceitePolitica && <span className="form-error">{errorsFisica.aceitePolitica.message}</span>}

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitJuridica(onSubmitJuridica)} className="auth-form">
              <div className="form-section">
                <h3 className="form-section-title">Dados da Empresa</h3>
                
                <div className="form-group">
                  <label className="form-label">Nome da Instituição</label>
                  <input
                    type="text"
                    className="form-input"
                    {...registerJuridica('nomeInstituicao', { required: 'Nome da instituição é obrigatório' })}
                  />
                  {errorsJuridica.nomeInstituicao && <span className="form-error">{errorsJuridica.nomeInstituicao.message}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">CNPJ</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="00.000.000/0000-00"
                      {...registerJuridica('cnpj', { required: 'CNPJ é obrigatório' })}
                    />
                    {errorsJuridica.cnpj && <span className="form-error">{errorsJuridica.cnpj.message}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Inscrição Estadual</label>
                    <input
                      type="text"
                      className="form-input"
                      {...registerJuridica('inscricaoEstadual', { required: 'Inscrição estadual é obrigatória' })}
                    />
                    {errorsJuridica.inscricaoEstadual && <span className="form-error">{errorsJuridica.inscricaoEstadual.message}</span>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">Dados do Responsável</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-input"
                      {...registerJuridica('nome', { required: 'Nome é obrigatório' })}
                    />
                    {errorsJuridica.nome && <span className="form-error">{errorsJuridica.nome.message}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Sobrenome</label>
                    <input
                      type="text"
                      className="form-input"
                      {...registerJuridica('sobrenome', { required: 'Sobrenome é obrigatório' })}
                    />
                    {errorsJuridica.sobrenome && <span className="form-error">{errorsJuridica.sobrenome.message}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">CPF do Responsável</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="000.000.000-00"
                      {...registerJuridica('cpf', { required: 'CPF é obrigatório' })}
                    />
                    {errorsJuridica.cpf && <span className="form-error">{errorsJuridica.cpf.message}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Telefone</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="(00) 00000-0000"
                      {...registerJuridica('telefone', { required: 'Telefone é obrigatório' })}
                    />
                    {errorsJuridica.telefone && <span className="form-error">{errorsJuridica.telefone.message}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Corporativo</label>
                  <input
                    type="email"
                    className="form-input"
                    {...registerJuridica('email', { 
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido'
                      }
                    })}
                  />
                  {errorsJuridica.email && <span className="form-error">{errorsJuridica.email.message}</span>}
                </div>
              </div>

              <div className="terms-checkbox">
                <input 
                  type="checkbox" 
                  id="responsibility"
                  {...registerJuridica('aceiteResponsabilidade', { required: 'Você deve aceitar o termo' })}
                />
                <label htmlFor="responsibility" className="terms-text">
                  Declaro que todos os documentos fornecidos são autênticos e assumo total responsabilidade pela veracidade das informações
                </label>
              </div>
              {errorsJuridica.aceiteResponsabilidade && <span className="form-error">{errorsJuridica.aceiteResponsabilidade.message}</span>}

              <div className="terms-checkbox">
                <input 
                  type="checkbox" 
                  id="terms-juridica"
                  {...registerJuridica('aceitePolitica', { required: 'Você deve aceitar a política de uso' })}
                />
                <label htmlFor="terms-juridica" className="terms-text">
                  Li e aceito a <a href="#">Política de Uso</a> e os <a href="#">Termos de Serviço</a>
                </label>
              </div>
              {errorsJuridica.aceitePolitica && <span className="form-error">{errorsJuridica.aceitePolitica.message}</span>}

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar Empresa'
                )}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <p>
              Já tem uma conta?{' '}
              <Link to="/login" className="auth-link">
                Faça login
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-side">
          <div className="auth-side-content">
            <h2>Portal Nacional de Editais</h2>
            <p>Acesse milhares de editais públicos de forma rápida e organizada</p>
            
            <div className="auth-features">
              <div className="auth-feature">
                <div className="feature-icon">📄</div>
                <div>
                  <h4>Acesso Completo</h4>
                  <p>Consulte editais de todos os setores</p>
                </div>
              </div>
              <div className="auth-feature">
                <div className="feature-icon">🔔</div>
                <div>
                  <h4>Notificações</h4>
                  <p>Receba alertas de novos editais</p>
                </div>
              </div>
              <div className="auth-feature">
                <div className="feature-icon">⭐</div>
                <div>
                  <h4>Favoritos</h4>
                  <p>Salve editais importantes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}