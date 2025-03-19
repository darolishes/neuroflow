#!/bin/bash

# Configuration
ORIGINAL_PROJECT_NAME="my-nextjs-template"  # Update this to match your template's name

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get user input
echo -e "${YELLOW}🚀 New Project Setup${NC}"
read -p "$(echo -e ${BLUE}"Enter new project name: "${NC})" PROJECT_NAME
read -p "$(echo -e ${BLUE}"Enter destination path (relative to current directory): "${NC})" DEST_DIR

# Resolve full destination path
FULL_DEST_PATH="$(pwd)/${DEST_DIR}"

# Check if directory exists
if [ -d "$FULL_DEST_PATH" ]; then
    read -p "Directory already exists. Overwrite? (y/n): " OVERWRITE
    if [ "$OVERWRITE" != "y" ]; then
        echo "Operation cancelled."
        exit 1
    fi
    rm -rf "$FULL_DEST_PATH"
fi

# Copy project files
echo -e "${CYAN}⚡ Copying project files to ${GREEN}$FULL_DEST_PATH${NC}..."
mkdir -p "$FULL_DEST_PATH"
tar cf - --exclude='node_modules' --exclude='.git' . | (cd "$FULL_DEST_PATH" && tar xf -)
cp .env.template "$FULL_DEST_PATH/"

# Update project name in key files
echo -e "${CYAN}⚙️ Updating project name in files...${NC}"
cd "$FULL_DEST_PATH" || exit 1

# Update package.json - using a more robust approach
if [ -f package.json ]; then
    # Use temp file approach to avoid issues with inline editing
    sed "s/\"name\": \"$ORIGINAL_PROJECT_NAME\"/\"name\": \"$PROJECT_NAME\"/" package.json > package.json.tmp
    mv package.json.tmp package.json
    echo -e "  ${GREEN}✓${NC} Updated package.json"
fi

# Update README.md if it exists
if [ -f README.md ]; then
    sed "s/$ORIGINAL_PROJECT_NAME/$PROJECT_NAME/g" README.md > README.md.tmp
    mv README.md.tmp README.md
    echo -e "  ${GREEN}✓${NC} Updated README.md"
fi

# Update next.config files if they exist
for config_file in next.config.js next.config.mjs next.config.ts; do
    if [ -f "$config_file" ]; then
        sed "s/$ORIGINAL_PROJECT_NAME/$PROJECT_NAME/g" "$config_file" > "$config_file.tmp"
        mv "$config_file.tmp" "$config_file"
        echo -e "  ${GREEN}✓${NC} Updated $config_file"
    fi
done

# Return to original directory
cd - > /dev/null

# Update the success message
echo -e "\n${GREEN}✅ Project cloned successfully to ${CYAN}$FULL_DEST_PATH${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "\n${YELLOW}🚀 Next steps:${NC}"
echo -e "1. ${BLUE}Review the automated updates to:${NC}"
echo -e "   ${CYAN}package.json${NC}"
echo -e "   ${CYAN}README.md${NC}"
echo -e "   ${CYAN}next.config.* files${NC}"
echo -e "2. ${BLUE}Create environment file:${NC}"
echo -e "   ${CYAN}cp .env.template .env.local${NC}"
echo -e "3. ${BLUE}Install dependencies:${NC}"
echo -e "   ${CYAN}cd $DEST_DIR && npm install${NC}"
echo -e "4. ${BLUE}Configure Supabase:${NC}"
echo -e "   - Create project at ${CYAN}https://supabase.com${NC}"
echo -e "   - Update ${CYAN}.env.local${NC} with your credentials"
echo -e "5. ${BLUE}Start development server:${NC}"
echo -e "   ${CYAN}npm run dev${NC}"

echo -e "\n${YELLOW}🚀 Open in Cursor?${NC}"
read -p "$(echo -e ${BLUE}"Would you like to open the project in Cursor? (y/n): "${NC})" OPEN_CURSOR

if [[ "$OPEN_CURSOR" =~ ^[Yy]$ ]]; then
    echo -e "${CYAN}Launching Cursor...${NC}"
    cursor "$FULL_DEST_PATH"
    echo -e "${GREEN}✅ Project opened in Cursor!${NC}"
fi

echo -e "\n${GREEN}💡 After setup, visit ${CYAN}http://localhost:3000${GREEN} to see the login screen!${NC}" 