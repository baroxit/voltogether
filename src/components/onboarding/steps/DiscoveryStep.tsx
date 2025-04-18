import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DiscoverySource } from '@/types';

interface DiscoveryStepProps {
  discoverySource: DiscoverySource | '';
  setDiscoverySource: (source: DiscoverySource) => void;
}

const DiscoveryStep = ({ discoverySource, setDiscoverySource }: DiscoveryStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Come ci hai conosciuto?</Label>
        <RadioGroup 
          value={discoverySource} 
          onValueChange={(value) => setDiscoverySource(value as DiscoverySource)}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="social-media" id="social-media" />
              <Label htmlFor="social-media">Social Media</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="friend" id="friend" />
              <Label htmlFor="friend">Consiglio di un amico</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advertisement" id="advertisement" />
              <Label htmlFor="advertisement">Pubblicità</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="previous-experiment" id="previous-experiment" />
              <Label htmlFor="previous-experiment">Dallo scorso esperimento</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="atmospheralab" id="atmospheralab" />
              <Label htmlFor="atmospheralab">AtmospheraLab</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cs1bc" id="cs1bc" />
              <Label htmlFor="cs1bc">Cs1bc</Label>
            </div>
            
            {/* <div className="flex items-center space-x-2">
              <RadioGroupItem value="news-article" id="news-article" />
              <Label htmlFor="news-article">Articolo o notizia</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="event" id="event" />
              <Label htmlFor="event">Evento o conferenza</Label>
            </div> */}
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Altro</Label>
            </div>

          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default DiscoveryStep;
