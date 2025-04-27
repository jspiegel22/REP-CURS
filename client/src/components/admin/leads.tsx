import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import type { Lead } from "@shared/schema";

export function Leads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const {
    data: leads = [],
    isLoading,
    isError,
    refetch
  } = useQuery<Lead[]>({
    queryKey: ["/api/admin/leads"],
  });

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.firstName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (lead.lastName?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
    const matchesType = filterType === "all" || lead.interestType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by interest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
              <SelectItem value="resort">Resort</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
              <SelectItem value="wedding">Wedding</SelectItem>
              <SelectItem value="group_trip">Group Trip</SelectItem>
              <SelectItem value="influencer">Influencer</SelectItem>
              <SelectItem value="concierge">Concierge</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => refetch()}>Refresh</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 my-8">
          Error loading leads. Please try again.
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center text-muted-foreground my-8">
          No leads found with current filters.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    {lead.createdAt && format(new Date(lead.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{lead.firstName || "-"}</TableCell>
                  <TableCell>{lead.lastName || "-"}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.phone || "-"}</TableCell>
                  <TableCell>
                    <span className="capitalize">{lead.interestType.replace('_', ' ')}</span>
                  </TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${lead.status === 'converted' ? 'bg-green-100 text-green-800' : 
                        lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                        lead.status === 'qualified' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {lead.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}