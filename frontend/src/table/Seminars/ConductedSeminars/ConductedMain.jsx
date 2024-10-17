import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react'
import React from 'react'
import ConductedTable from './ConductedTable';

function ConductedMain() {
  return (
    <div>
        <Button to="/faculty/seminars/upcoming">Add Upcoming Seminars</Button>
        <ConductedTable/>
        
    </div>
  )
};

export default ConductedMain;
