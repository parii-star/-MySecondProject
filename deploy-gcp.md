# GCP Deployment Guide

## Code Changes Made

Your code is now compatible with GCP deployment:

1. **Backend Database Connection** - Updated to support Cloud SQL Unix socket connections
2. **Server Binding** - Changed to `0.0.0.0` for Cloud Run compatibility
3. **Environment Variables** - Added support for GCP-specific configuration
4. **Cloud Build Configuration** - Created `cloudbuild.yaml` for automated deployments
5. **Docker Images** - Fixed Dockerfile issues

## Next Steps

### Step 6: Build & Push Docker Images

```bash
# Set your project ID
export PROJECT_ID="YOUR_PROJECT_ID"
export REGION="asia-south2"

# Authenticate Docker
gcloud auth configure-docker ${REGION}-docker.pkg.dev

# Build and push backend
docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/myfirstproject-repo/backend:latest ./backend
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/myfirstproject-repo/backend:latest

# Build and push frontend
docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/myfirstproject-repo/frontend:latest \
  --build-arg VITE_API_BASE_URL=https://backend-xxxxx-xx.a.run.app/api \
  ./frontend
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/myfirstproject-repo/frontend:latest
```

### Step 7: Create Secrets in Secret Manager

```bash
# Create secrets for database credentials
echo -n "mysecondprojectuser" | gcloud secrets create DB_USER --data-file=-
echo -n "your-db-password" | gcloud secrets create DB_PASSWORD --data-file=-
echo -n "mydatabase" | gcloud secrets create DB_NAME --data-file=-
```

### Step 8: Deploy Backend to Cloud Run

```bash
# Get Cloud SQL connection name
export SQL_CONNECTION=$(gcloud sql instances describe mysecondprojectdb --format="value(connectionName)")

# Deploy backend
gcloud run deploy backend \
  --image=${REGION}-docker.pkg.dev/${PROJECT_ID}/myfirstproject-repo/backend:latest \
  --region=${REGION} \
  --platform=managed \
  --allow-unauthenticated \
  --add-cloudsql-instances=${SQL_CONNECTION} \
  --set-env-vars=DB_SOCKET_PATH=/cloudsql/${SQL_CONNECTION} \
  --set-secrets=DB_USER=DB_USER:latest,DB_PASSWORD=DB_PASSWORD:latest,DB_NAME=DB_NAME:latest \
  --max-instances=10 \
  --memory=512Mi
```

### Step 9: Deploy Frontend to Cloud Run

```bash
# Get backend URL from previous deployment
export BACKEND_URL=$(gcloud run services describe backend --region=${REGION} --format="value(status.url)")

# Rebuild frontend with correct backend URL
docker build -t ${REGION}-docker.pkg.dev/${PROJECT_ID}/myfirstproject-repo/frontend:latest \
  --build-arg VITE_API_BASE_URL=${BACKEND_URL}/api \
  ./frontend
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/myfirstproject-repo/frontend:latest

# Deploy frontend
gcloud run deploy frontend \
  --image=${REGION}-docker.pkg.dev/${PROJECT_ID}/myfirstproject-repo/frontend:latest \
  --region=${REGION} \
  --platform=managed \
  --allow-unauthenticated \
  --max-instances=10 \
  --memory=256Mi
```

### Step 10: Setup Cloud Build (Automated CI/CD)

1. Update `cloudbuild.yaml` with your actual values:
   - Replace `_CLOUD_SQL_CONNECTION_NAME`
   - Replace `_BACKEND_URL` after first deployment

2. Connect to GitHub:
   ```bash
   gcloud builds triggers create github \
     --name="deploy-on-push" \
     --repo-name="MySecondProject" \
     --repo-owner="parii-star" \
     --branch-pattern="^main$" \
     --build-config="cloudbuild.yaml"
   ```

## Environment Variables Reference

### Backend Environment Variables (Cloud Run)
- `DB_SOCKET_PATH`: `/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME`
- `DB_USER`: From Secret Manager
- `DB_PASSWORD`: From Secret Manager
- `DB_NAME`: From Secret Manager
- `PORT`: Automatically set by Cloud Run (8080)
- `ALLOWED_ORIGINS`: Frontend Cloud Run URL

### Frontend Build Args
- `VITE_API_BASE_URL`: Backend Cloud Run URL + `/api`
