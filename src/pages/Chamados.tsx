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

interface Chamado {
  id: string;
  escola: string;
  dataAtendimento: string;
  problemaRelatado: string;
  solucaoAplicada: string;
  tecnicoResponsavel: string;
  equipamentoRelacionado: string;
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'concluido';
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

export function Chamados() {
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtros, setFiltros] = useState({
    escola: '',
    status: '',
    tecnico: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    // Carregar chamados do localStorage
    const savedChamados = localStorage.getItem('ti-chamados');
    if (savedChamados) {
      setChamados(JSON.parse(savedChamados));
    } else {
      // Dados iniciais para demonstração
      const initialChamados: Chamado[] = [
        {
          id: '1',
          escola: 'Escola Municipal Santos',
          dataAtendimento: '2024-01-15',
          problemaRelatado: 'Computador não liga',
          solucaoAplicada: 'Substituição da fonte de alimentação',
          tecnicoResponsavel: 'João Silva',
          equipamentoRelacionado: 'Desktop Administrativo 01',
          prioridade: 'alta',
          status: 'concluido'
        },
        {
          id: '2',
          escola: 'Colégio Central',
          dataAtendimento: '2024-01-16',
          problemaRelatado: 'Impressora não imprime',
          solucaoAplicada: 'Limpeza dos cabeçotes e troca de cartucho',
          tecnicoResponsavel: 'Maria Santos',
          equipamentoRelacionado: 'Impressora Sala Professores',
          prioridade: 'media',
          status: 'concluido'
        }
      ];
      setChamados(initialChamados);
      localStorage.setItem('ti-chamados', JSON.stringify(initialChamados));
    }

    // Carregar equipamentos para o dropdown
    const savedEquipamentos = localStorage.getItem('ti-equipments');
    if (savedEquipamentos) {
      setEquipamentos(JSON.parse(savedEquipamentos));
    }
  }, []);

  const saveChamados = (newChamados: Chamado[]) => {
    setChamados(newChamados);
    localStorage.setItem('ti-chamados', JSON.stringify(newChamados));
  };

  const handleAddChamado = (formData: FormData) => {
    const newChamado: Chamado = {
      id: Date.now().toString(),
      escola: formData.get('escola') as string,
      dataAtendimento: formData.get('dataAtendimento') as string,
      problemaRelatado: formData.get('problemaRelatado') as string,
      solucaoAplicada: formData.get('solucaoAplicada') as string,
      tecnicoResponsavel: formData.get('tecnicoResponsavel') as string,
      equipamentoRelacionado: formData.get('equipamentoRelacionado') as string,
      prioridade: formData.get('prioridade') as 'baixa' | 'media' | 'alta',
      status: 'concluido'
    };

    const updatedChamados = [...chamados, newChamado];
    saveChamados(updatedChamados);
    setIsDialogOpen(false);
    
    toast({
      title: "Chamado registrado!",
      description: `Atendimento na ${newChamado.escola} foi registrado com sucesso.`,
    });
  };

  const chamadosFiltrados = chamados.filter(chamado => {
    return (
      (!filtros.escola || chamado.escola === filtros.escola) &&
      (!filtros.status || chamado.status === filtros.status) &&
      (!filtros.tecnico || chamado.tecnicoResponsavel === filtros.tecnico)
    );
  });

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'destructive';
      case 'media': return 'secondary';  
      case 'baixa': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido': return 'default';
      case 'pendente': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chamados Atendidos</h1>
          <p className="text-muted-foreground">Registro de atendimentos realizados</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Registrar Chamado</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Novo Chamado</DialogTitle>
              <DialogDescription>
                Registre um atendimento realizado
              </DialogDescription>
            </DialogHeader>
            <ChamadoForm onSubmit={handleAddChamado} equipamentos={equipamentos} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Chamados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{chamados.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Prioridade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {chamados.filter(c => c.prioridade === 'alta').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {chamados.filter(c => {
                const dataAtendimento = new Date(c.dataAtendimento);
                const agora = new Date();
                return dataAtendimento.getMonth() === agora.getMonth() && 
                       dataAtendimento.getFullYear() === agora.getFullYear();
              }).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">
              {chamados.filter(c => c.status === 'concluido').length}
            </div>
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
              <Label>Status</Label>
              <Select value={filtros.status} onValueChange={(value) => setFiltros({...filtros, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
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
          </div>
        </CardContent>
      </Card>

      {/* Lista de Chamados */}
      <div className="space-y-4">
        {chamadosFiltrados.map((chamado) => (
          <Card key={chamado.id} className="shadow-soft">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{chamado.escola}</CardTitle>
                  <CardDescription>
                    Atendido em {new Date(chamado.dataAtendimento).toLocaleDateString('pt-BR')} por {chamado.tecnicoResponsavel}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getPrioridadeColor(chamado.prioridade)}>
                    {chamado.prioridade}
                  </Badge>
                  <Badge variant={getStatusColor(chamado.status)}>
                    {chamado.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <strong className="text-sm text-muted-foreground">Problema Relatado:</strong>
                  <p className="text-sm mt-1">{chamado.problemaRelatado}</p>
                </div>
                
                <div>
                  <strong className="text-sm text-muted-foreground">Solução Aplicada:</strong>
                  <p className="text-sm mt-1">{chamado.solucaoAplicada}</p>
                </div>
                
                {chamado.equipamentoRelacionado && (
                  <div>
                    <strong className="text-sm text-muted-foreground">Equipamento:</strong>
                    <p className="text-sm mt-1">{chamado.equipamentoRelacionado}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {chamadosFiltrados.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhum chamado encontrado com os filtros aplicados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ChamadoForm({ onSubmit, equipamentos }: { onSubmit: (formData: FormData) => void; equipamentos: any[] }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="escola">Escola *</Label>
          <Select name="escola" required>
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
          <Label htmlFor="dataAtendimento">Data do Atendimento *</Label>
          <Input 
            id="dataAtendimento" 
            name="dataAtendimento" 
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
          <Label htmlFor="prioridade">Prioridade *</Label>
          <Select name="prioridade" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="equipamentoRelacionado">Equipamento Relacionado</Label>
        <Select name="equipamentoRelacionado">
          <SelectTrigger>
            <SelectValue placeholder="Selecione o equipamento (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nenhum equipamento específico</SelectItem>
            {equipamentos.map(eq => (
              <SelectItem key={eq.id} value={eq.nome}>
                {eq.nome} - {eq.patrimonio}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="problemaRelatado">Problema Relatado *</Label>
        <Textarea 
          id="problemaRelatado" 
          name="problemaRelatado" 
          placeholder="Descreva o problema relatado..."
          required 
        />
      </div>

      <div>
        <Label htmlFor="solucaoAplicada">Solução Aplicada *</Label>
        <Textarea 
          id="solucaoAplicada" 
          name="solucaoAplicada" 
          placeholder="Descreva a solução que foi aplicada..."
          required 
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Registrar Chamado</Button>
      </div>
    </form>
  );
}