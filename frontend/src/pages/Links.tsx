import { useState, useEffect } from 'react';
import { useApi, UrlShortener } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, 
} from '@/components/ui/alert-dialog';
import { 
  CalendarIcon, 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink, 
  Clock,
  Link as LinkIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function Links() {
  const [urls, setUrls] = useState<UrlShortener[]>([]);
  const [editingUrl, setEditingUrl] = useState<UrlShortener | null>(null);
  const [editOriginalUrl, setEditOriginalUrl] = useState('');
  const [editExpiryDate, setEditExpiryDate] = useState<Date>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { getUrls, updateUrl, deleteUrl, loading } = useApi();
  const { toast } = useToast();

  useEffect(() => {
    loadUrls();
  }, []);

  const loadUrls = async () => {
    try {
      const urlList = await getUrls();
      setUrls(urlList);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load URLs.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (url: UrlShortener) => {
    setEditingUrl(url);
    setEditOriginalUrl(url.originalUrl);
    setEditExpiryDate(url.expiresAt ? new Date(url.expiresAt) : undefined);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingUrl) return;

    try {
      await updateUrl(
        editingUrl.id,
        editOriginalUrl,
        editExpiryDate ? editExpiryDate.toISOString() : undefined
      );
      
      toast({
        title: 'Updated!',
        description: 'URL has been successfully updated.',
      });
      
      setIsEditDialogOpen(false);
      setEditingUrl(null);
      loadUrls();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update URL.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUrl(id);
      toast({
        title: 'Deleted!',
        description: 'URL has been successfully deleted.',
      });
      loadUrls();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete URL.',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'URL has been copied to your clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Copy failed',
        description: 'Failed to copy URL to clipboard.',
        variant: 'destructive',
      });
    }
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Links</h1>
        <p className="text-muted-foreground mt-2">
          Manage all your shortened URLs
        </p>
      </div>

      {loading && urls.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading your links...</p>
          </div>
        </div>
      ) : urls.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <LinkIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No links yet</h3>
            <p className="text-muted-foreground text-center">
              You haven't created any short links yet. Go to the dashboard to create your first one!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {urls.map((url) => (
            <Card key={url.id} className={cn(isExpired(url.expiresAt) && 'opacity-60')}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-primary">{url.shortCode}</h3>
                        {isExpired(url.expiresAt) && (
                          <Badge variant="destructive">Expired</Badge>
                        )} 
                      </div>
                      <p className="text-sm text-muted-foreground break-all">
                        {url.originalUrl}
                      </p>
                    </div> 
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Created {format(new Date(url.createdAt), 'MMM d, yyyy')}</span>
                      </div>
                      
                      {url.expiresAt && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            Expires {format(new Date(url.expiresAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(url.shortUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(url.shortUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(url)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete URL</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this short URL? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(url.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit URL</DialogTitle>
            <DialogDescription>
              Update the original URL and expiry date for your short link.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-url">Original URL</Label>
              <Input
                id="edit-url"
                type="url"
                value={editOriginalUrl}
                onChange={(e) => setEditOriginalUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !editExpiryDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editExpiryDate ? format(editExpiryDate, 'PPP') : 'Pick an expiry date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editExpiryDate}
                    onSelect={setEditExpiryDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {editExpiryDate && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditExpiryDate(undefined)}
                  className="text-muted-foreground"
                >
                  Clear date
                </Button>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? 'Updating...' : 'Update URL'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}