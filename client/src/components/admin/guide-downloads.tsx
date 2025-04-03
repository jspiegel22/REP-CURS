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

// Type for guide submissions from the API
type GuideSubmission = {
  id: number;
  firstName: string;
  email: string;
  guideType: string;
  source: string;
  status: string;
  formName: string;
  submissionId: string;
  createdAt: string;
  updatedAt: string;
};

export function GuideDownloads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGuideType, setFilterGuideType] = useState("all");

  const {
    data: submissions = [],
    isLoading,
    isError,
    refetch
  } = useQuery<GuideSubmission[]>({
    queryKey: ["/api/admin/guide-submissions"],
  });

  // Filter submissions based on search and filter
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.firstName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGuideType = filterGuideType === "all" || submission.guideType.includes(filterGuideType);
    
    return matchesSearch && matchesGuideType;
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
          <Select value={filterGuideType} onValueChange={setFilterGuideType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by guide" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Guides</SelectItem>
              <SelectItem value="Cabo">Cabo Guide</SelectItem>
              <SelectItem value="Villa">Villa Guide</SelectItem>
              <SelectItem value="Resort">Resort Guide</SelectItem>
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
          Error loading guide submissions. Please try again.
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="text-center text-muted-foreground my-8">
          No guide downloads found with current filters.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Guide Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">
                    {submission.createdAt && format(new Date(submission.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{submission.firstName}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.guideType}</TableCell>
                  <TableCell>{submission.source}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${submission.status === 'sent' ? 'bg-green-100 text-green-800' : 
                        submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {submission.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Resend</Button>
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