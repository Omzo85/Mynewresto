/*
  # Schéma initial pour le restaurant

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - lié à auth.users
      - `email` (text)
      - `full_name` (text)
      - `address` (text)
      - `phone` (text)
      - `is_admin` (boolean)
      - `created_at` (timestamp)

    - `dishes`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `long_description` (text)
      - `price` (decimal)
      - `image_url` (text)
      - `category` (text)
      - `available` (boolean)
      - `created_at` (timestamp)

    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - référence profiles.id
      - `status` (text)
      - `total_amount` (decimal)
      - `delivery_address` (text)
      - `created_at` (timestamp)

    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid) - référence orders.id
      - `dish_id` (uuid) - référence dishes.id
      - `quantity` (integer)
      - `price_at_time` (decimal)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
    - Add policies for admin access
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text,
  address text,
  phone text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create dishes table
CREATE TABLE dishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  long_description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  category text NOT NULL,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total_amount decimal(10,2) NOT NULL,
  delivery_address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) NOT NULL,
  dish_id uuid REFERENCES dishes(id) NOT NULL,
  quantity integer NOT NULL,
  price_at_time decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for dishes
CREATE POLICY "Anyone can view available dishes"
  ON dishes FOR SELECT
  TO authenticated
  USING (available = true);

CREATE POLICY "Admins can manage dishes"
  ON dishes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Policies for orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policies for order_items
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
      AND orders.user_id = auth.uid()
    )
  );