import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface FiltrosRelatorio {
  escola: string;
  tipoEquipamento: string;
  situacaoEquipamento: string;
  dataInicio: string;
  dataFim: string;
  tecnico: string;
}

const escolas = [
  'Escola Municipal Santos',
  'Escola Estadual Silva',
  'Colégio Central',
  'Escola Rural Norte',
  'Instituto Tecnológico'
];

const tiposEquipamento = [
  'PC', 'Notebook', 'Impressora', 'Projetor', 'Monitor', 'Tablet', 'Roteador'
];

const situacoes = [
  'Em uso', 'Disponível', 'Manutenção', 'Descartado'
];

const tecnicos = [
  'João Silva',
  'Maria Santos', 
  'Pedro Oliveira',
  'Ana Costa',
  'Carlos Lima'
];

export function Relatorios() {
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({
    escola: '',
    tipoEquipamento: '',
    situacaoEquipamento: '',
    dataInicio: '',
    dataFim: '',
    tecnico: ''
  });
  
  const [dadosRelatorio, setDadosRelatorio] = useState({
    equipamentos: [],
    chamados: [],
    avaliacoes: []
  });

  useEffect(() => {
    // Carregar dados do localStorage
    const equipamentos = JSON.parse(localStorage.getItem('ti-equipments') || '[]');
    const chamados = JSON.parse(localStorage.getItem('ti-chamados') || '[]');
    const avaliacoes = JSON.parse(localStorage.getItem('ti-avaliacoes') || '[]');
    
    setDadosRelatorio({ equipamentos, chamados, avaliacoes });
  }, []);

  const gerarRelatorio = () => {
    let equipamentosFiltrados = dadosRelatorio.equipamentos;
    let chamadosFiltrados = dadosRelatorio.chamados;
    let avaliacoesFiltradas = dadosRelatorio.avaliacoes;

    // Filtrar equipamentos
    if (filtros.escola) {
      equipamentosFiltrados = equipamentosFiltrados.filter((eq: any) => eq.local === filtros.escola);
    }
    if (filtros.tipoEquipamento) {
      equipamentosFiltrados = equipamentosFiltrados.filter((eq: any) => eq.tipo === filtros.tipoEquipamento);
    }
    if (filtros.situacaoEquipamento) {
      equipamentosFiltrados = equipamentosFiltrados.filter((eq: any) => eq.situacao === filtros.situacaoEquipamento);
    }

    // Filtrar chamados
    if (filtros.escola) {
      chamadosFiltrados = chamadosFiltrados.filter((ch: any) => ch.escola === filtros.escola);
    }
    if (filtros.tecnico) {
      chamadosFiltrados = chamadosFiltrados.filter((ch: any) => ch.tecnicoResponsavel === filtros.tecnico);
    }
    if (filtros.dataInicio && filtros.dataFim) {
      chamadosFiltrados = chamadosFiltrados.filter((ch: any) => {
        const dataAtendimento = new Date(ch.dataAtendimento);
        const inicio = new Date(filtros.dataInicio);
        const fim = new Date(filtros.dataFim);
        return dataAtendimento >= inicio && dataAtendimento <= fim;
      });
    }

    // Filtrar avaliações
    if (filtros.escola) {
      avaliacoesFiltradas = avaliacoesFiltradas.filter((av: any) => av.nomeEscola === filtros.escola);
    }
    if (filtros.tecnico) {
      avaliacoesFiltradas = avaliacoesFiltradas.filter((av: any) => av.tecnicoResponsavel === filtros.tecnico);
    }

    return {
      equipamentos: equipamentosFiltrados,
      chamados: chamadosFiltrados,
      avaliacoes: avaliacoesFiltradas
    };
  };

  const relatorio = gerarRelatorio();

  const exportarRelatorio = () => {
    const dataExport = {
      filtros,
      dataGeracao: new Date().toISOString(),
      resultados: relatorio,
      resumo: {
        totalEquipamentos: relatorio.equipamentos.length,
        totalChamados: relatorio.chamados.length,
        totalAvaliacoes: relatorio.avaliacoes.length
      }
    };

    const blob = new Blob([JSON.stringify(dataExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-ti-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const limparFiltros = () => {
    setFiltros({
      escola: '',
      tipoEquipamento: '',
      situacaoEquipamento: '',
      dataInicio: '',
      dataFim: '',
      tecnico: ''
    });
  };

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'Em uso': return 'default';
      case 'Disponível': return 'secondary';
      case 'Manutenção': return 'destructive';
      case 'Descartado': return 'outline';
      default: return 'outline';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'destructive';
      case 'media': return 'secondary';
      case 'baixa': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">Gere relatórios personalizados do sistema</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={limparFiltros}>
            Limpar Filtros
          </Button>
          <Button onClick={exportarRelatorio}>
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros do Relatório</CardTitle>
          <CardDescription>Configure os filtros para gerar relatórios personalizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Escola</Label>
              <Select value={filtros.escola} onValueChange={(value) => setFiltros({...filtros, escola: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as escolas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as escolas</SelectItem>
                  {escolas.map(escola => (
                    <SelectItem key={escola} value={escola}>{escola}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Tipo de Equipamento</Label>
              <Select value={filtros.tipoEquipamento} onValueChange={(value) => setFiltros({...filtros, tipoEquipamento: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  {tiposEquipamento.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Situação do Equipamento</Label>
              <Select value={filtros.situacaoEquipamento} onValueChange={(value) => setFiltros({...filtros, situacaoEquipamento: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as situações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as situações</SelectItem>
                  {situacoes.map(situacao => (
                    <SelectItem key={situacao} value={situacao}>{situacao}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Data Início</Label>
              <Input 
                type="date" 
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Data Fim</Label>
              <Input 
                type="date" 
                value={filtros.dataFim}
                onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
              />
            </div>
            
            <div>
              <Label>Técnico</Label>
              <Select value={filtros.tecnico} onValueChange={(value) => setFiltros({...filtros, tecnico: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os técnicos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os técnicos</SelectItem>
                  {tecnicos.map(tecnico => (
                    <SelectItem key={tecnico} value={tecnico}>{tecnico}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{relatorio.equipamentos.length}</div>
            <p className="text-xs text-muted-foreground">Total encontrado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chamados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{relatorio.chamados.length}</div>
            <p className="text-xs text-muted-foreground">Total encontrado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">{relatorio.avaliacoes.length}</div>
            <p className="text-xs text-muted-foreground">Total encontrado</p>
          </CardContent>
        </Card>
      </div>

      {/* Resultados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipamentos */}
        <Card>
          <CardHeader>
            <CardTitle>Equipamentos ({relatorio.equipamentos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {relatorio.equipamentos.slice(0, 10).map((eq: any) => (
                <div key={eq.id} className="flex justify-between items-center text-sm">
                  <div>
                    <div className="font-medium">{eq.nome}</div>
                    <div className="text-muted-foreground">{eq.tipo} - {eq.local}</div>
                  </div>
                  <Badge variant={getSituacaoColor(eq.situacao)}>
                    {eq.situacao}
                  </Badge>
                </div>
              ))}
              {relatorio.equipamentos.length > 10 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{relatorio.equipamentos.length - 10} equipamentos...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chamados */}
        <Card>
          <CardHeader>
            <CardTitle>Chamados ({relatorio.chamados.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {relatorio.chamados.slice(0, 10).map((ch: any) => (
                <div key={ch.id} className="flex justify-between items-start text-sm">
                  <div>
                    <div className="font-medium">{ch.escola}</div>
                    <div className="text-muted-foreground">{new Date(ch.dataAtendimento).toLocaleDateString('pt-BR')}</div>
                    <div className="text-xs text-muted-foreground">{ch.tecnicoResponsavel}</div>
                  </div>
                  <Badge variant={getPrioridadeColor(ch.prioridade)}>
                    {ch.prioridade}
                  </Badge>
                </div>
              ))}
              {relatorio.chamados.length > 10 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{relatorio.chamados.length - 10} chamados...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avaliações */}
      {relatorio.avaliacoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Avaliações ({relatorio.avaliacoes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatorio.avaliacoes.slice(0, 6).map((av: any) => (
                <div key={av.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">{av.nomeEscola}</div>
                    <Badge variant={av.condicoesInfraestrutura >= 4 ? 'default' : av.condicoesInfraestrutura >= 3 ? 'secondary' : 'destructive'}>
                      {av.condicoesInfraestrutura}/5
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(av.dataVisita).toLocaleDateString('pt-BR')} - {av.tecnicoResponsavel}
                  </div>
                </div>
              ))}
            </div>
            {relatorio.avaliacoes.length > 6 && (
              <div className="text-xs text-muted-foreground text-center mt-3">
                +{relatorio.avaliacoes.length - 6} avaliações...
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {relatorio.equipamentos.length === 0 && relatorio.chamados.length === 0 && relatorio.avaliacoes.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhum dado encontrado com os filtros aplicados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}