import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function Dashboard() {
  // Dados simulados para demonstração
  const equipmentStats = {
    total: 245,
    inUse: 201,
    maintenance: 12,
    available: 32
  };

  const ticketStats = {
    today: 8,
    thisWeek: 34,
    thisMonth: 127
  };

  const recentActivities = [
    { id: 1, action: "Novo equipamento cadastrado", item: "Notebook Dell Latitude", time: "2 horas atrás" },
    { id: 2, action: "Chamado atendido", item: "Escola Municipal Santos", time: "4 horas atrás" },
    { id: 3, action: "Equipamento em manutenção", item: "Projetor Epson", time: "6 horas atrás" },
    { id: 4, action: "Avaliação registrada", item: "Escola Estadual Silva", time: "1 dia atrás" }
  ];

  const schoolTickets = [
    { school: "Escola Municipal Santos", tickets: 12, status: "alta" },
    { school: "Escola Estadual Silva", tickets: 8, status: "media" },
    { school: "Colégio Central", tickets: 5, status: "baixa" },
    { school: "Escola Rural Norte", tickets: 15, status: "alta" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'alta': return 'destructive';
      case 'media': return 'secondary';
      case 'baixa': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema de TI</p>
      </div>

      {/* Estatísticas de Equipamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipamentos</CardTitle>
            <div className="h-4 w-4 rounded bg-primary"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{equipmentStats.total}</div>
            <p className="text-xs text-muted-foreground">Todos os equipamentos</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Uso</CardTitle>
            <div className="h-4 w-4 rounded bg-success"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{equipmentStats.inUse}</div>
            <p className="text-xs text-muted-foreground">Equipamentos ativos</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manutenção</CardTitle>
            <div className="h-4 w-4 rounded bg-warning"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{equipmentStats.maintenance}</div>
            <p className="text-xs text-muted-foreground">Precisam de reparo</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
            <div className="h-4 w-4 rounded bg-accent"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent-foreground">{equipmentStats.available}</div>
            <p className="text-xs text-muted-foreground">Prontos para uso</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chamados por Escola */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Chamados por Escola</CardTitle>
            <CardDescription>Quantidade de chamados atendidos este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schoolTickets.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{item.school}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(item.status)}>
                      {item.tickets} chamados
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Atividades Recentes */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas atualizações do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.item}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas de Chamados */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Resumo de Chamados Atendidos</CardTitle>
          <CardDescription>Estatísticas de atendimento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{ticketStats.today}</div>
              <p className="text-sm text-muted-foreground">Hoje</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success">{ticketStats.thisWeek}</div>
              <p className="text-sm text-muted-foreground">Esta Semana</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-foreground">{ticketStats.thisMonth}</div>
              <p className="text-sm text-muted-foreground">Este Mês</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}