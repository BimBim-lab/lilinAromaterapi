
import { Router, Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Workshop from "@/pages/Workshop";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Export from "@/pages/Export";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/workshop" component={Workshop} />
              <Route path="/contact" component={Contact} />
              <Route path="/blog" component={Blog} />
              <Route path="/blog/:slug" component={BlogPost} />
              <Route path="/export" component={Export} />
              <Route path="/admin" component={Admin} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </Router>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
