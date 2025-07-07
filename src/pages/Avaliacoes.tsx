import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Avaliacao {
  id: string;
  nomeEscola: string;
  dataVisita: string;
  condicoesInfraestrutura: number;
  observacoes: string;
  recomendacoesMelhorias: string;
  tecnicoResponsavel: string;
}

const escolas = [
  'Escola Municipal Santos',
  'Escola Estadual Silva',
  'Colégio Central',
  'Escola Rural Norte', 
  'Instituto Tecnológico'
];

const tecnicos = [
  'João Silva',
  'Maria Santos',
  'Pedro Oliveira',
  'Ana Costa',
  'Carlos Lima'
];

export function Avaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtros, setFiltros] = useState({
    escola: '',
    tecnico: '',
    nota: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedAvaliacoes = localStorage.getItem('ti-avaliacoes');
    if (savedAvaliacoes) {
      setAvaliacoes(JSON.parse(savedAvaliacoes));
    } else {
      // Dados iniciais para demonstração
      const initialAvaliacoes: Avaliacao[] = [
        {
          id: '1',
          nomeEscola: 'Escola Municipal Santos',
          dataVisita: '2024-01-10',
          condicoesInfraestrutura: 4,
          observacoes: 'Laboratório de informática em boas condições. Rede wi-fi funcionando adequadamente.',
          recomendacoesMelhorias: 'Substituir 2 computadores mais antigos. Instalar ponto de rede adicional na sala dos professores.',
          tecnicoResponsavel: 'João Silva'
        },
        {
          id: '2',
          nomeEscola: 'Colégio Central',
          dataVisita: '2024-01-12',
          condicoesInfraestrutura: 3,
          observacoes: 'Alguns equipamentos precisam de manutenção. Cabeamento de rede organizado.',
          recomendacoesMelhorias: 'Upgrade de memória em 3 computadores. Configuração de backup automático.',
          tecnicoResponsavel: 'Maria Santos'
        }
      ];
      setAvaliacoes(initialAvaliacoes);
      localStorage.setItem('ti-avaliacoes', JSON.stringify(initialAvaliacoes));
    }
  }, []);

  const saveAvaliacoes = (newAvaliacoes: Avaliacao[]) => {
    setAvaliacoes(newAvaliacoes);
    localStorage.setItem('ti-avaliacoes', JSON.stringify(newAvaliacoes));
  };

  const handleAddAvaliacao = (formData: FormData) => {
    const newAvaliacao: Avaliacao = {
      id: Date.now().toString(),
      nomeEscola: formData.get('nomeEscola') as string,
      dataVisita: formData.get('dataVisita') as string,
      condicoesInfraestrutura: parseInt(formData.get('condicoesInfraestrutura') as string),
      observacoes: formData.get('observacoes') as string,
      recomendacoesMelhorias: formData.get('recomendacoesMelhorias') as string,
      tecnicoResponsavel: formData.get('tecnicoResponsavel') as string
    };

    const updatedAvaliacoes = [...avaliacoes, newAvaliacao];
    saveAvaliacoes(updatedAvaliacoes);
    setIsDialogOpen(false);
    
    toast({
      title: "Avaliação registrada!",
      description: `Avaliação da ${newAvaliacao.nomeEscola} foi salva com sucesso.`,
    });
  };

  const avaliacoesFiltradas = avaliacoes.filter(avaliacao => {
    return (
      (!filtros.escola || avaliacao.nomeEscola === filtros.escola) &&
      (!filtros.tecnico || avaliacao.tecnicoResponsavel === filtros.tecnico) &&
      (!filtros.nota || avaliacao.condicoesInfraestrutura.toString() === filtros.nota)
    );
  });

  const getNotaColor = (nota: number) => {
    if (nota >= 4) return 'default';
    if (nota >= 3) return 'secondary';
    return 'destructive';
  };

  const getNotaTexto = (nota: number) => {
    switch (nota) {
      case 1: return 'Muito Ruim';
      case 2: return 'Ruim';
      case 3: return 'Regular';
      case 4: return 'Bom';
      case 5: return 'Excelente';
      default: return 'N/A';
    }
  };

  const calcularEstatisticas = () => {
    const total = avaliacoes.length;
    const mediaGeral = total > 0 ? (avaliacoes.reduce((acc, av) => acc + av.condicoesInfraestrutura, 0) / total).toFixed(1) : '0';
    const escolasAvaliadas = new Set(avaliacoes.map(av => av.nomeEscola)).size;
    const necessitamMelhoria = avaliacoes.filter(av => av.condicoesInfraestrutura <= 2).length;

    return { total, mediaGeral, escolasAvaliadas, necessitamMelhoria };
  };

  const stats = calcularEstatisticas();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Avaliação das Escolas</h1>
          <p className="text-muted-foreground">Relatórios de infraestrutura de TI</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Nova Avaliação</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nova Avaliação</DialogTitle>
              <DialogDescription>
                Registre uma avaliação da infraestrutura de TI
              </DialogDescription>
            </DialogHeader>
            <AvaliacaoForm onSubmit={handleAddAvaliacao} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Avaliações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escolas Avaliadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.escolasAvaliadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">{stats.mediaGeral}/5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Necessitam Melhoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.necessitamMelhoria}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
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
            
            <div>
              <Label>Nota</Label>
              <Select value={filtros.nota} onValueChange={(value) => setFiltros({...filtros, nota: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as notas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as notas</SelectItem>
                  <SelectItem value="5">5 - Excelente</SelectItem>
                  <SelectItem value="4">4 - Bom</SelectItem>
                  <SelectItem value="3">3 - Regular</SelectItem>
                  <SelectItem value="2">2 - Ruim</SelectItem>
                  <SelectItem value="1">1 - Muito Ruim</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Avaliações */}
      <div className="space-y-4">
        {avaliacoesFiltradas.map((avaliacao) => (
          <Card key={avaliacao.id} className="shadow-soft">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{avaliacao.nomeEscola}</CardTitle>
                  <CardDescription>
                    Avaliada em {new Date(avaliacao.dataVisita).toLocaleDateString('pt-BR')} por {avaliacao.tecnicoResponsavel}
                  </CardDescription>
                </div>
                <Badge variant={getNotaColor(avaliacao.condicoesInfraestrutura)}>
                  {avaliacao.condicoesInfraestrutura}/5 - {getNotaTexto(avaliacao.condicoesInfraestrutura)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong className="text-sm text-muted-foreground">Observações:</strong>
                  <p className="text-sm mt-1">{avaliacao.observacoes}</p>
                </div>
                
                <div>
                  <strong className="text-sm text-muted-foreground">Recomendações de Melhorias:</strong>
                  <p className="text-sm mt-1">{avaliacao.recomendacoesMelhorias}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {avaliacoesFiltradas.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma avaliação encontrada com os filtros aplicados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AvaliacaoForm({ onSubmit }: { onSubmit: (formData: FormData) => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nomeEscola">Nome da Escola *</Label>
          <Select name="nomeEscola" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a escola" />
            </SelectTrigger>
            <SelectContent>
              {escolas.map(escola => (
                <SelectItem key={escola} value={escola}>{escola}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="dataVisita">Data da Visita *</Label>
          <Input 
            id="dataVisita" 
            name="dataVisita" 
            type="date" 
            required 
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div>
          <Label htmlFor="tecnicoResponsavel">Técnico Responsável *</Label>
          <Select name="tecnicoResponsavel" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o técnico" />
            </SelectTrigger>
            <SelectContent>
              {tecnicos.map(tecnico => (
                <SelectItem key={tecnico} value={tecnico}>{tecnico}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="condicoesInfraestrutura">Condições de Infraestrutura (1-5) *</Label>
          <Select name="condicoesInfraestrutura" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a nota" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Muito Ruim</SelectItem>
              <SelectItem value="2">2 - Ruim</SelectItem>
              <SelectItem value="3">3 - Regular</SelectItem>
              <SelectItem value="4">4 - Bom</SelectItem>
              <SelectItem value="5">5 - Excelente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="observacoes">Observações *</Label>
        <Textarea 
          id="observacoes" 
          name="observacoes" 
          placeholder="Descreva as condições gerais encontradas..."
          required 
        />
      </div>

      <div>
        <Label htmlFor="recomendacoesMelhorias">Recomendações de Melhorias *</Label>
        <Textarea 
          id="recomendacoesMelhorias" 
          name="recomendacoesMelhorias" 
          placeholder="Liste as melhorias recomendadas..."
          required 
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Registrar Avaliação</Button>
      </div>
    </form>
  );
}