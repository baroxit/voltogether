
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { SUSTAINABLE_ACTIONS } from '@/types';
import { CheckCircle } from 'lucide-react';

const NextEvents = () => {
  // Getting random recommended actions for the next day
  const recommendedActions = SUSTAINABLE_ACTIONS.slice(0, 3);

  return (
    <Card className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <CardTitle className="text-xl font-semibold mb-4">Prossimi Eventi</CardTitle>
      <CardContent className="p-0">
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium">Sfida Giornaliera</p>
                <p className="text-sm text-gray-500">Domani, 19:00 - 20:00</p>
              </div>
              <span className="text-xs font-medium px-2 py-1 bg-voltgreen-100 text-voltgreen-700 rounded-full">
                +10 punti per azione
              </span>
            </div>
            
            <div className="mt-3 pl-3">
              <p className="text-sm font-medium mb-2">Azioni consigliate:</p>
              <div className="space-y-1.5">
                {recommendedActions.map(action => (
                  <div key={action.id} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-voltgreen-500" />
                    <span className="text-sm">{action.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <div>
              <p className="font-medium">Sfida Energetica Speciale</p>
              <p className="text-sm text-gray-500">Questo weekend</p>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-voltgreen-100 text-voltgreen-700 rounded-full">
              +20 punti per azione
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextEvents;
