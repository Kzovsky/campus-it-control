import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Equipment {
  id: string;
  nome: string;
  tipo: string;
  modelo: string;
  patrimonio: string;
  local: string;
  situacao: string;
  especificacoes: Record<string, string>;
  dataInclusao: string;
}

const equipmentTypes = [
  'PC', 'Notebook', 'Impressora', 'Projetor', 'Monitor', 'Tablet', 'Roteador'
];

const situacoes = [
  'Em uso', 'Disponível', 'Manutenção', 'Descartado'
];

const escolas = [
  'Escola Municipal Santos',
  'Escola Estadual Silva',
  'Colégio Central', 
  'Escola Rural Norte',
  'Instituto Tecnológico'
];

export function Equipamentos() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    tipo: '',
    situacao: '',
    local: ''
  });
  const { toast } = useToast();

  // Carregar equipamentos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ti-equipments');
    if (saved) {
      setEquipments(JSON.parse(saved));
    } else {
      // Dados iniciais para demonstração
      const initialData: Equipment[] = [
        {
          id: '1',
          nome: 'Desktop Administrativo 01',
          tipo: 'PC',
          modelo: 'Dell OptiPlex 3080',
          patrimonio: 'TI001234',
          local: 'Escola Municipal Santos',
          situacao: 'Em uso',
          especificacoes: {
            processador: 'Intel Core i5-10400',
            memoria: '8GB DDR4',
            armazenamento: '256GB SSD',
            sistemaOperacional: 'Windows 11 Pro'
          },
          dataInclusao: '2024-01-15'
        },
        {
          id: '2',
          nome: 'Impressora Sala Professores',
          tipo: 'Impressora',
          modelo: 'HP LaserJet Pro M404dn',
          patrimonio: 'TI001235',
          local: 'Colégio Central',
          situacao: 'Em uso',
          especificacoes: {
            tipo: 'Laser',
            conectividade: 'USB, Ethernet'
          },
          dataInclusao: '2024-01-20'
        }
      ];
      setEquipments(initialData);
      localStorage.setItem('ti-equipments', JSON.stringify(initialData));
    }
  }, []);

  const saveEquipments = (newEquipments: Equipment[]) => {
    setEquipments(newEquipments);
    localStorage.setItem('ti-equipments', JSON.stringify(newEquipments));
  };

  const handleAddEquipment = (formData: FormData) => {
    const nome = formData.get('nome') as string;
    const tipo = formData.get('tipo') as string;
    const modelo = formData.get('modelo') as string;
    const patrimonio = formData.get('patrimonio') as string;
    const local = formData.get('local') as string;
    const situacao = formData.get('situacao') as string;

    // Especificações dinâmicas baseadas no tipo
    const especificacoes: Record<string, string> = {};
    
    if (tipo === 'PC' || tipo === 'Notebook') {
      especificacoes.processador = formData.get('processador') as string || '';
      especificacoes.memoria = formData.get('memoria') as string || '';
      especificacoes.armazenamento = formData.get('armazenamento') as string || '';
      especificacoes.sistemaOperacional = formData.get('sistemaOperacional') as string || '';
    } else if (tipo === 'Impressora') {
      especificacoes.tipo = formData.get('tipoImpressora') as string || '';
      especificacoes.conectividade = formData.get('conectividade') as string || '';
    } else if (tipo === 'Projetor') {
      especificacoes.lumens = formData.get('lumens') as string || '';
      especificacoes.resolucao = formData.get('resolucao') as string || '';
      especificacoes.conectividade = formData.get('conectividade') as string || '';
    }

    const newEquipment: Equipment = {
      id: Date.now().toString(),
      nome,
      tipo,
      modelo,
      patrimonio,
      local,
      situacao,
      especificacoes,
      dataInclusao: new Date().toISOString().split('T')[0]
    };

    const updatedEquipments = [...equipments, newEquipment];
    saveEquipments(updatedEquipments);
    setIsDialogOpen(false);
    
    toast({
      title: "Equipamento adicionado!",
      description: `${nome} foi cadastrado com sucesso.`,
    });
  };

  const filteredEquipments = equipments.filter(eq => {
    return (
      (!filters.tipo || eq.tipo === filters.tipo) &&
      (!filters.situacao || eq.situacao === filters.situacao) &&
      (!filters.local || eq.local === filters.local)
    );
  });

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'Em uso': return 'default';
      case 'Disponível': return 'secondary';
      case 'Manutenção': return 'destructive';
      case 'Descartado': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Equipamentos</h1>
          <p className="text-muted-foreground">Controle de equipamentos de TI</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Equipamento</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Equipamento</DialogTitle>
              <DialogDescription>
                Preencha as informações do equipamento
              </DialogDescription>
            </DialogHeader>
            <EquipmentForm onSubmit={handleAddEquipment} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Tipo de Equipamento</Label>
              <Select value={filters.tipo} onValueChange={(value) => setFilters({...filters, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  {equipmentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Situação</Label>
              <Select value={filters.situacao} onValueChange={(value) => setFilters({...filters, situacao: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as situações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as situações</SelectItem>
                  {situacoes.map(sit => (
                    <SelectItem key={sit} value={sit}>{sit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Localização</Label>
              <Select value={filters.local} onValueChange={(value) => setFilters({...filters, local: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as localizações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as localizações</SelectItem>
                  {escolas.map(escola => (
                    <SelectItem key={escola} value={escola}>{escola}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Equipamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipments.map((equipment) => (
          <Card key={equipment.id} className="shadow-soft">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{equipment.nome}</CardTitle>
                <Badge variant={getSituacaoColor(equipment.situacao)}>
                  {equipment.situacao}
                </Badge>
              </div>
              <CardDescription>{equipment.modelo}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Tipo:</strong> {equipment.tipo}</div>
                <div><strong>Patrimônio:</strong> {equipment.patrimonio}</div>
                <div><strong>Local:</strong> {equipment.local}</div>
                
                {Object.keys(equipment.especificacoes).length > 0 && (
                  <div className="pt-2 border-t">
                    <strong>Especificações:</strong>
                    <div className="mt-1 space-y-1">
                      {Object.entries(equipment.especificacoes).map(([key, value]) => (
                        <div key={key} className="text-xs text-muted-foreground">
                          <span className="capitalize">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhum equipamento encontrado com os filtros aplicados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EquipmentForm({ onSubmit }: { onSubmit: (formData: FormData) => void }) {
  const [selectedType, setSelectedType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nome">Nome do Equipamento *</Label>
          <Input id="nome" name="nome" required />
        </div>
        
        <div>
          <Label htmlFor="tipo">Tipo *</Label>
          <Select name="tipo" onValueChange={setSelectedType} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {equipmentTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="modelo">Modelo *</Label>
          <Input id="modelo" name="modelo" required />
        </div>
        
        <div>
          <Label htmlFor="patrimonio">Patrimônio *</Label>
          <Input id="patrimonio" name="patrimonio" required />
        </div>
        
        <div>
          <Label htmlFor="local">Local *</Label>
          <Select name="local" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o local" />
            </SelectTrigger>
            <SelectContent>
              {escolas.map(escola => (
                <SelectItem key={escola} value={escola}>{escola}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="situacao">Situação *</Label>
          <Select name="situacao" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a situação" />
            </SelectTrigger>
            <SelectContent>
              {situacoes.map(sit => (
                <SelectItem key={sit} value={sit}>{sit}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Especificações dinâmicas */}
      {(selectedType === 'PC' || selectedType === 'Notebook') && (
        <div className="space-y-4">
          <h4 className="font-medium">Especificações Técnicas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="processador">Processador</Label>
              <Input id="processador" name="processador" placeholder="Ex: Intel Core i5-10400" />
            </div>
            <div>
              <Label htmlFor="memoria">Memória RAM</Label>
              <Input id="memoria" name="memoria" placeholder="Ex: 8GB DDR4" />
            </div>
            <div>
              <Label htmlFor="armazenamento">Armazenamento</Label>
              <Input id="armazenamento" name="armazenamento" placeholder="Ex: 256GB SSD" />
            </div>
            <div>
              <Label htmlFor="sistemaOperacional">Sistema Operacional</Label>
              <Input id="sistemaOperacional" name="sistemaOperacional" placeholder="Ex: Windows 11 Pro" />
            </div>
          </div>
        </div>
      )}

      {selectedType === 'Impressora' && (
        <div className="space-y-4">
          <h4 className="font-medium">Especificações da Impressora</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipoImpressora">Tipo</Label>
              <Select name="tipoImpressora">
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de impressora" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laser">Laser</SelectItem>
                  <SelectItem value="Jato de Tinta">Jato de Tinta</SelectItem>
                  <SelectItem value="Matricial">Matricial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="conectividade">Conectividade</Label>
              <Input id="conectividade" name="conectividade" placeholder="Ex: USB, Ethernet, Wi-Fi" />
            </div>
          </div>
        </div>
      )}

      {selectedType === 'Projetor' && (
        <div className="space-y-4">
          <h4 className="font-medium">Especificações do Projetor</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="lumens">Lumens</Label>
              <Input id="lumens" name="lumens" placeholder="Ex: 3000 ANSI" />
            </div>
            <div>
              <Label htmlFor="resolucao">Resolução</Label>
              <Input id="resolucao" name="resolucao" placeholder="Ex: 1920x1080" />
            </div>
            <div>
              <Label htmlFor="conectividade">Conectividade</Label>
              <Input id="conectividade" name="conectividade" placeholder="Ex: HDMI, VGA, USB" />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="submit">Salvar Equipamento</Button>
      </div>
    </form>
  );
}